//#region Copyright, Version, and Description
/*
 * Copyright 2014 IdeaBlade, Inc.  All Rights Reserved.  
 * Use, reproduction, distribution, and modification of this code is subject to the terms and 
 * conditions of the IdeaBlade Breeze license, available at http://www.breezejs.com/license
 *
 * Author: Ward Bell
 * Version: 1.0.4.angular
 * --------------------------------------------------------------------------------
 * Adds "Save Queuing" capability to new EntityManagers
 * "Save Queuing" automatically queues and defers an EntityManager.saveChanges call
 * when another save is in progress for that manager.
 *
 * Without "Save Queuing", an EntityManager will throw an exception when
 * saveChanges is called while another save is in progress.
 *
 * "Save Queuing" is experimental. It may become part of BreezeJS in future
 * although not necessarily in this form or with this API
 * 
 * Must call EntityManager.enableSaveQueuing(true) to turn it on;
 * EntityManager.enableSaveQueuing(false) restores the manager's original 
 * saveChanges method as it was at the time saveQueuing was first enabled.
 * 
 * This module adds "enableSaveQueuing" to the EntityManager prototype.
 * Calling "enableSaveQueuing(true)" adds a new _saveQueuing object 
 * to the manager instance.
 * 
 * !!! Use with caution !!!
 * "Save Queuing" is recommended only in simple "auto-save" scenarios wherein
 * users make rapid changes and the UI saves immediately as they do so.
 * It is usually better (and safer) to disable save in the UI
 * while waiting for a prior save to complete
 *
 * All members of EntityManager._saveQueuing are internal; 
 * touch them at your own risk.
 */
//#endregion
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
    var Q = breeze.Q; // thanks to breeze.angular service

    var EntityManager = breeze.EntityManager;

    /**
    Enable (default) or disable "Save Queuing" for this manager
    **/
    EntityManager.prototype.enableSaveQueuing = function (enable) {
        enable = enable === undefined ? true : enable;
        if (!this._saveQueuing) {
            this._saveQueuing = new SaveQueuing(this);
        }
        if (enable) {
            this.saveChanges = saveChangesWithQueuing;
        } else {
            this.saveChanges = this._saveQueuing.baseSaveChanges;
        }
    };


    var SaveQueuing = function (entityManager) {
        this.entityManager = entityManager;
        this.baseSaveChanges = entityManager.saveChanges;
        this.isSaving = false;
        this.saveQueue = [];
    };

    SaveQueuing.prototype.isEnabled = function () {
        return this.entityManager.saveChanges === saveChangesWithQueuing;
    };

    /**
    Replacement for EntityManager.saveChanges, extended with "Save Queuing"
    **/
    function saveChangesWithQueuing() {
        var saveQueuing = this._saveQueuing;
        var args = [].slice.call(arguments);

        if (saveQueuing.isSaving) {
            // save in progress; queue the save for later
            return saveQueuing.queueSaveChanges(args);
        } else {
            // note that save is in progrees; then save
            saveQueuing.isSaving = true;
            return saveQueuing.innerSaveChanges(args);
        }
    }

    SaveQueuing.prototype.queueSaveChanges = function (args) {
        var self = this;
        var deferredSave = Q.defer();
        self.saveQueue.push(deferredSave);

        // clone saveOptions because may change later, before this save is dequeued
        args[1] = breeze.core.extend(new breeze.SaveOptions(),
            args[1] || this.entityManager.saveOptions || breeze.SaveOptions.defaultInstance);

        var savePromise = deferredSave.promise;
        return savePromise
            .then(function () { return self.innerSaveChanges(args); })
            .then(null,function (error) { self.saveFailed(error); });
    };

    SaveQueuing.prototype.innerSaveChanges = function (args) {
        var self = this;
        return self.baseSaveChanges.apply(self.entityManager, args)
            .then(function (saveResult) { return self.saveSucceeded(saveResult); })
            .then(null, function (error) { self.saveFailed(error); });
    };

    // Default methods and Error class for initializing new saveQueuing objects
    SaveQueuing.prototype.saveSucceeded = defaultSaveSucceeded;
    SaveQueuing.prototype.saveFailed = defaultSaveFailed;
    SaveQueuing.prototype.QueuedSaveFailedError = QueuedSaveFailedError;

    function defaultSaveSucceeded(saveResult) {
        var saveQueuing = this;
        var deferredSave = saveQueuing.saveQueue.shift();
        if (deferredSave) {
            deferredSave.resolve();
        }
        if (saveQueuing.saveQueue.length === 0) {
            saveQueuing.isSaving = false;
        }
        return saveResult;
    };

    function defaultSaveFailed(error) {
        var saveQueuing = this;
        saveQueuing.isSaving = false;
        var saveQueue = saveQueuing.saveQueue;
        var deferredSave;
        // clear the save queue, calling reject on each deferred save
        while (deferredSave = saveQueue.shift()) {
            deferredSave.reject(new saveQueuing.QueuedSaveFailedError(error, saveQueuing));
        }
        throw error; // so rest of current promise chain can hear error
    }

    //#region QueuedSaveFailedError
    //Custom Error sub-class; thrown when rejecting queued saves.
    function QueuedSaveFailedError(errObject) {
        this.name = "QueuedSaveFailedError";
        this.message = "Queued save failed";
        this.innerError = errObject;
    }

    QueuedSaveFailedError.prototype = new Error();
    QueuedSaveFailedError.prototype.constructor = QueuedSaveFailedError;
    //#endregion

}, this));