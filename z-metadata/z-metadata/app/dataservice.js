/* dataservice: data access and model management layer 
 * relies on Angular injector to provide:
 *     $timeout - Angular equivalent of 'setTimeout'
 *     breeze - the Breeze.Angular service (which is breeze itself)
 *     logger - the application's logging facility
 */
(function() {

    angular.module('app').factory('dataservice',
    ['$timeout', 'breeze', 'entityManagerFactory', 'logger', dataservice]);

    function dataservice($timeout, breeze, emFactory, logger) {

        var manager = emFactory.getEntityManager();

        var service = {
            addPropertyChangeHandler: addPropertyChangeHandler,
            cleanup: cleanup,
            createTodo: createTodo,
            dbPurge: dbPurge,
            dbReset: dbReset,
            deleteTodo: deleteTodo,
            getTodos: getTodos,
            hasChanges: hasChanges,
            saveChanges: saveChanges
        };
        return service;

        /*** implementation details ***/

        function addPropertyChangeHandler(handler) {
            // Actually adds any 'entityChanged' event handler
            // call handler when an entity property of any entity changes
            return manager.entityChanged.subscribe(function(changeArgs) {
                var action = changeArgs.entityAction;
                if (action === breeze.EntityAction.PropertyChange) {
                    handler(changeArgs);
                }
            });
        }

        function cleanup(handler) {
            // removes any 'entityChanged' event handler
            return manager.entityChanged.unsubscribe(handler);
        }

        function createTodo(initialValues) {
            return manager.createEntity('TodoItem', initialValues);
        }

        function deleteTodo(todoItem) {
            todoItem && todoItem.entityAspect.setDeleted();
        }

        function getTodos(includeArchived) {
            var query = breeze.EntityQuery
                .from("Todos")
                .orderBy("CreatedAt");

            if (!includeArchived) { // if excluding archived Todos ...
                // add filter clause limiting results to non-archived Todos
                query = query.where("IsArchived", "==", false);
            }

            var promise = manager.executeQuery(query).catch(queryFailed);
            return promise;

            function queryFailed(error) {
                logger.error(error.message, "Query failed");
                throw error; // so downstream promise users know it failed
            }
        }

        function hasChanges() {
            return manager.hasChanges();
        }

        function handleSaveValidationError(error) {
            var message = "Not saved due to validation error";
            try { // fish out the first error
                var firstErr = error.entityErrors[0];
                message += ": " + firstErr.errorMessage;
            } catch (e) { /* eat it for now */ }
            return message;
        }

        function dbPurge(callback) {
            // Todo: breeze should support commands to the controller
            // Simplified: fails silently
            $.post(emFactory.serviceName + '/purge', function () {
                logger.success("database purged.");
                manager.clear();
                if (callback) callback();
            });
        }

        function dbReset(callback) {
            // Todo: breeze should support commands to the controller
            // Simplified: fails silently
            $.post(emFactory.serviceName + '/reset', function () {
                logger.success("database reset.");
                manager.clear();
                if (callback) callback();
            });
        }

        function saveChanges() {
            return manager.saveChanges()
                .then(saveSucceeded)
                .catch(saveFailed);

            function saveSucceeded(saveResult) {
                logger.success("# of Todos saved = " + saveResult.entities.length);
                logger.log(saveResult);
            }

            function saveFailed(error) {
                var reason = error.message;
                var detail = error.detail;

                if (error.entityErrors) {
                    reason = handleSaveValidationError(error);
                } else if (detail && detail.ExceptionType &&
                    detail.ExceptionType.indexOf('OptimisticConcurrencyException') !== -1) {
                    // Concurrency error 
                    reason =
                        "Another user, perhaps the server, " +
                        "may have deleted one or all of the todos." +
                        " You may have to restart the app.";
                } else {
                    reason = "Failed to save changes: " + reason +
                        " You may have to restart the app.";
                }

                logger.error(error, reason);
                // DEMO ONLY: discard all pending changes
                // Let them see the error for a second before rejecting changes
                $timeout(function() {
                    manager.rejectChanges();
                }, 1000);
                throw error; // so downstream promise users know it failed
            }

        }
    }

})();