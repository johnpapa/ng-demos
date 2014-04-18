/*
 * Extend breeze with saveErrorMessageService,   
 * a utility service for processing errors returned from a save.
 *
 * Depends on Breeze which it patches
 *
 * `getErrorMessage is its primary method (see example).
 *
 * The default implementation extracts validation error messages and 
 * arranges for server validation errors to be removed from an entity 
 * the next time this entity changes in any way.
 *
 * The service API includes implementation methods that can be overriden (replaced)
 * to change the behavior just described
 * 
 * This extension is not prescriptive! 
 * It is only one approach to save error message handling.
 * Use it for inspiration.
 *
 * Copyright 2013 IdeaBlade, Inc.  All Rights Reserved.  
 * Licensed under the MIT License
 * http://opensource.org/licenses/mit-license.php
 * Author: Ward Bell
 *
 * v.1.0.3
 *
 * Install:
 *   1) include this script after breeze script
 *   2) use it in your save failure handler
 *
 * Example:
 *   return manager.saveChanges().then(saveSucceeded, saveFailed);
 *   
 *   function saveFailed(error) {
 *       var msg = 'Save failed: ' + breeze.saveErrorMessageService.getErrorMessage(error);
 *       error.message = msg;
 *       logError(msg, error);
 *       throw error;
 *   }
 * 
*/
(function (definition, window) {
    if (window.breeze) {
        definition(window.breeze);
    } else if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS or Node
        var b = require('breeze');
        definition(b);
    } else if (typeof define === "function" && define["amd"] && !window.breeze) {
        // Requirejs / AMD 
        define(['breeze'], definition);
    } else {
        throw new Error("Can't find breeze");
    }
}(function (breeze) {
	'use strict';

    var service = {
    	// The main service function
    	getErrorMessage: getErrorMessage,

    	// Replaceable implementation methods
    	getEntityName: getEntityName,
    	getMessageFromEntityError: getMessageFromEntityError,
    	reviewServerErrors: reviewServerErrors
    }

	breeze.saveErrorMessageService = service;

    // The main service function
	function getErrorMessage(error) {
		var msg = error.message;
		var entityErrors = error.entityErrors;
		if (entityErrors && entityErrors.length) {
			service.reviewServerErrors(entityErrors);
			return getValidationMessages(entityErrors);
		}
		return msg;
	}


	function getValidationMessages(entityErrors) {
        var isServerError = entityErrors[0].isServerError; // if the first is, they all are
		try {
		    return entityErrors.map(service.getMessageFromEntityError).join('; <br/>');
		} catch (e) {
			/* eat it for now */
			return (isServerError ? 'server' : 'client') + ' validation error';
		}
	}

	// default implementation of service.getMessageFromEntityError
	function getMessageFromEntityError(entityError){
        var entity = entityError.entity;
        if (entity) {
            var name = service.getEntityName(entity);
        }
        name = name ? name += ' - ' : '';

		return name + '\'' + entityError.errorMessage + '\'';
	}

	// default implementation of service.getEntityName
	function getEntityName(entity) {
		var key = entity.entityAspect.getKey();
		var name = key.entityType.shortName;
		var id = key.values.join(',');
		return name + ' (' + id + ')';
	}


	// default implementation of service.reviewServerErrors
	function reviewServerErrors(entityErrors){
		var entitiesWithServerErrors = [];
		entityErrors.forEach(function(entityError){
			var entity = entityError.isServerError && entityError.entity;
			if (entity && entitiesWithServerErrors.indexOf(entity) === -1) {
				entitiesWithServerErrors.push(entity);
				clearServerErrorsOnNextChange(entity);
			}
		})
	}

	function clearServerErrorsOnNextChange(badEntity) {

		if (badEntity.entityAspect.entityState.isDetached()) { return; }

		// implemented as a one-time, propertyChanged eventhandler that
	    // clears the server validation errors if anything happens to this entity
		(function(entity) {
			var manager = entity.entityAspect.entityManager;
			var subKey = manager.entityChanged.subscribe(function(changeArgs) {
				if (changeArgs.entity === entity) {
					manager.entityChanged.unsubscribe(subKey);
					var aspect = entity.entityAspect;
					aspect.getValidationErrors().forEach(function(err) {
						if (err.isServerError) {
							aspect.removeValidationError(err);
						}
					});
				}
			});
		})(badEntity);
	}
}, this));