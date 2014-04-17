/*
 * A utility service loaded with helper methods and access to selected services
 * (e.g. logger, $timeout) that are often needed by other services.
 * Collecting them in a single util service reduces repetitious dependency injection
 * and long lists of constructor parameters in those services.
 */
(function(angular) {
    'use strict';

    angular.module( "app" ).factory( 'util',
        ['$q', '$rootScope', '$timeout', 'config', 'logger', factory]);

    function factory($q, $rootScope, $timeout, config, logger) {

        extendString();

        return {
            // bundle these so util clients don't have to get them
            $q      : $q,
            $timeout: $timeout,
            config: config,
            logger: logger,

            // actual utilities
            $broadcast: $broadcast,

            deal: deal,
            defineProperty: defineProperty,
            filterById: filterById,
            filterByName: filterByName,
            filterByType: filterByType,
            filterHttpError: filterHttpError,
            getEntityByIdFromObj: getEntityByIdFromObj,
            getEntityManager: getEntityManager,
            getSaveErrorMessages: getSaveErrorMessages,
            getEntityValidationErrMsgs: getEntityValidationErrMsgs,
            groupArray: groupArray,
            keyArray: keyArray,
            toTitle: toTitle,
            resolved: $q.when(true) // a re-usable resolved promise
        };
        /////////////////////
        function $broadcast() {
            return $rootScope.$broadcast.apply($rootScope, arguments);
        }

        // Assist in adding an ECMAScript 5 "definedProperty" to a class
        function defineProperty(klass, propertyName, getter, setter){
            var config = {
                enumerable: true,
                get: getter
            };
            if (setter){
                config.set = setter;
            }
            Object.defineProperty(klass.prototype, propertyName, config);
        }

        /*********************************************************
         * Array filter factories
         *********************************************************/
        function filterById(array) {
            return function (id) {
                var item = array.filter(function (x) { return x.id == id; });//"==" ok; want coercion
                return item[0] || null;
            };
        }
        function filterByName(array) {
            // name is either a regExp or a string which is converted to a regex ignore case
            return function (name) {
                var re = (typeof name === 'string') ? new RegExp(name, 'i') : name;
                return array.filter(function (x) { return re.test(x.name); });
            };
        }
        function filterByType(array) {
            return function (type) {
                // type is either a regExp or a string which is converted to a regex ignore case
                var re = (typeof type === 'string') ? new RegExp(type, 'i') : type;
                return array.filter(function (x) { return re.test(x.type); });
            };
        }

        // filter some http errors
        function filterHttpError(error){
            var message = error.message;
            var status = error.status;
            if (status === 0 && !message ){
                error.message = 'It appears the request timed-out. Is the MongoDb server running?';
            }
            return error;
        }

        /** Complex type helpers **/
        function getEntityByIdFromObj(obj, typeName, id)  {
            var em = getEntityManager(obj);
            return (em) ? em.getEntityByKey(typeName, id) : null;
        }

        function getEntityManager(obj){
            if (obj.complexAspect) {
                return obj.complexAspect.getEntityAspect().entityManager;
            } else if (obj.entityAspect) {
                return obj.entityAspect.entityManager;
            }   else {
                return null;
            }
        }

        /*********************************************************
         * Handle save error messages
         *********************************************************/
        function getSaveErrorMessages(error) {
            var msg = error.message;
            var detail = error.detail;
            if (msg.match(/validation error/i)) {
                return getValidationMessages(error);
            } else if (detail && detail.ExceptionType &&
                detail.ExceptionType.indexOf('OptimisticConcurrencyException') !== -1) {
                // Concurrency error
                return "Another user, perhaps the server, " +
                    "may have changed or deleted an entity in the change-set.";
            }
            return msg;
        }

        function getValidationMessages(error) {

            var detail = error.detail;

            if (detail) { // Failed validation on the server
                try {
                    return 'Server ' + detail.ExceptionMessage + '\nStackTrace: ' + detail.StackTrace;
                } catch (e) {
                    return 'Server ' + error.message;
                }
            }

            // Failed on client during pre-Save validation
            try {
                return error.entitiesWithErrors.map(function (entity) {
                    return entity.entityAspect.getValidationErrors().map(function (valError) {
                        return valError.errorMessage;
                    }).join(', \n');
                }).join('; \n');
            }
            catch (e) {
                return "validation error (error parsing exception :'" + e.message + "')";
            }
        }

        /*********************************************************
         * Return an entity's validation error messages as a string
         *********************************************************/
        function getEntityValidationErrMsgs(entity) {
            var errs = entity.entityAspect.getValidationErrors();
            return errs.length ?
                errs.map(function (err) { return err.errorMessage; }).join(", ") :
                "no errors";
        }

        /*******************************************************
         * String extensions
         * Monkey punching JavaScript native String class
         * w/ format, startsWith, endsWith
         * go ahead and shoot me but it's convenient
         ********************************************************/
        function extendString() {
            var stringFn = String.prototype;
            if (stringFn.format) { return; } // already extended

            // Ex: "{0} returned {1} item(s)".format(queryName, count));
            stringFn.format = stringFn.format || function () {
                var s = this;
                for (var i = 0, len = arguments.length; i < len; i++) {
                    var reg = new RegExp("\\{" + i + "\\}", "gm");
                    s = s.replace(reg, arguments[i]);
                }

                return s;
            };

            stringFn.endsWith = stringFn.endsWith || function (suffix) {
                return (this.substr(this.length - suffix.length) === suffix);
            };

            stringFn.startsWith = stringFn.startsWith || function (prefix) {
                return (this.substr(0, prefix.length) === prefix);
            };

            stringFn.contains = stringFn.contains || function (value) {
                return (this.indexOf(value) !== -1);
            };
        }

        /*********************************************************
         * Deal an array of things into "hands" as if dealing cards.
         * e.g. deal([1,2,3,4,5,6,7], 3) -> [[1,4,7],[2,5],[3,6]]
         *********************************************************/
        function deal(arr, numHands) {
            var hands = new Array(numHands);
            var i, len = arr.length, hand;
            for (i = 0; i < numHands; i++) {
                hands[i] = [];
            }
            for (i = 0; i < len; i++) {
                hand = Math.ceil(i % numHands);
                hands[hand].push(arr[i]);
            }
            return hands;
        }

        /*********************************************************
         // Group an array of objects by an object property. Each element of the returned array
         // is a object { keyName: key, valueName: [{...},...] }
         // arr: array of objects
         // keyfn: function to get the desired group key from each object
         // keyName: name of key property in resulting objects (defaults to 'key')
         // valueName: name of values property in resulting objects (defaults to 'values')
         // returns: array of key,values objects, where the values are objects from the original array.
         // See utilSpec.js for an example.
         *********************************************************/
        function groupArray(arr, keyfn, keyName, valueName) {
            keyName = keyName || 'key';
            valueName = valueName || 'values';
            var groupMap = {};
            var groupList = [];
            arr.forEach(function (o) {
                var key = keyfn(o);
                var group = groupMap[key];
                if (!group) {
                    group = {};
                    group[keyName] = key;
                    group[valueName] = [];
                    groupMap[key] = group;
                    groupList.push(group);
                }
                group[valueName].push(o);
            });
            return groupList;
        }

        /*********************************************************
         // Convert an array into an object.  The returned object has keys defined by the keyfn,
         // and values from the original array.  If there are duplicate keys, the resulting object
         // has the value of the last key.
         // arr: array of objects
         // keyfn: function to get the desired group key from each object
         // See utilSpec.js for an example.
         *********************************************************/
        function keyArray(arr, keyfn) {
            var map = {};
            arr.forEach(function (o) {
                var key = keyfn(o);
                map[key] = o;
            });
            return map;
        }

        // Turn identifiers 'somethingLikeThis' into a title "Something Like This'
        // Example in Zza: orderItem.html uses it to build tab headers from
        // product option types (e.g., 'saladDressing' -> 'Salad Dressing')
        function toTitle(text) {
            return text ? convert() : "";
            function convert(){
                // space before leading caps & uppercase the 1st character
                // runs of caps are their own word, e.g., 'anHTMLstring' -> 'An HTML String'
                return text.replace(/([A-Z]*[^A-Z]*)/g, ' $1')
                    .replace(/([A-Z]{2,})/g, '$1 ')
                    .trim()
                    .replace(/^\w/, function (c) { return c.toUpperCase(); });
            }
        }

    }

})(this.angular);
