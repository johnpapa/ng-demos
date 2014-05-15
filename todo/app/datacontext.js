/*
 * datacontext service encapsulates data access and model definition
 */
(function (){
    'use strict';
    angular.module('app').factory('datacontext',
        ['$log','$q', 'breeze', 'entityManagerFactory', 'wip-service', service]);

    function service($log, $q, breeze, entityManagerFactory, wip){
        var addedState = breeze.EntityState.Added;
        var deletedState = breeze.EntityState.Deleted;
        var manager;
        var todoItemType;

        var datacontext = {
            addTodoItem:      addTodoItem,
            counts:           {},
            deleteTodoItem:   deleteTodoItem,
            getAllTodoItems:  getAllTodoItems,
            hasChanges:       hasChanges,
            loadTodoItems:    loadTodoItems,
            ready:            ready,
            reset:            reset,
            sync:             sync
        };

        return datacontext;
        /////////////////////////////
        function ready(){
            return entityManagerFactory.getEntityManager().then(haveEntityManager);

            function haveEntityManager(em){
                manager = em;
                manager.entityChanged.subscribe(entityCountsChanged);
                todoItemType = manager.metadataStore.getEntityType('TodoItem');
                updateCounts();
                return true;
            }
        }

        function addTodoItem(initialValues){
            return manager.createEntity(todoItemType, initialValues);
        }

        function deleteTodoItem(todoItem){
            var aspect = todoItem.entityAspect;
            if (aspect.entityState !== breeze.EntityState.Detached){
                aspect.setDeleted();
            }
        }

        function entityCountsChanged(changeArgs){
            var action = changeArgs.entityAction;
            if (action !== breeze.EntityAction.PropertyChange){
                updateCounts();
            }
        }





        // Get all TodoItems from the server and cache combined
        function getAllTodoItems() {

            // Create the query
            var query = breeze.EntityQuery.from('TodoItem');
//                .orderBy('text');
//                .where('text', 'startsWith', 'L');

            // Execute the query
            return manager.executeQuery(query)
                .then(success).catch(queryFailed);

            function success(data){
                // Interested in what server has then we are done.
                var fetched = data.results;
                $log.log('breeze query succeeded. fetched: '+ fetched.length);

                // Blended results.
                // This gets me all local changes and what the server game me.
                return manager.getEntities(todoItemType);

                // Normally would re-query the cache to combine cached and fetched
                // but need the deleted entities too for this UI.
                // For demo, we returned every cached Todo
                // Warning: the cache will accumulate entities that
                // have been deleted by other users until it is entirely rebuilt via 'refresh'
            }

        }







        function hasChanges(){
            return manager.hasChanges();
        }

        function loadTodoItems(){
            wip.restore();
            return getAllTodoItems();
        }

        function prettifyErrorMessage(message){
            // When message returns the TodoItem guid id,
            // try to replace with the TodoItem text which displays better
            var re=/with id '([1234567890abcdef\-]*)'/i;
            var match = message && message.match(re);
            if (match){
                var id = match[1];
                var todo = id && manager.getEntityByKey('TodoItem',id);
                if (todo) {
                    message = message.replace(re,'named "'+todo.text+'"')+" [key: "+id+"]";
                }
            }
            return message;
        }

        function queryFailed(error) {
            error.message = prettifyErrorMessage(error.message);
            var status = error.status ? error.status + ' - ' : '';
            var err = status + (error.message ? error.message : 'Unknown error; check console.log.');
            err += '\nIs the server running?';
            return $q.reject(err); // so downstream listener gets it.
        }

        // Clear everything local and reload from server.
        function reset(){
            wip.stop();
            wip.clear();
            manager.clear();
            return getAllTodoItems()
                .finally(function(){wip.resume();});
        }

        function sync(){
            return manager.saveChanges()
                .then(function (){
                    $log.log('breeze save succeeded');
                    wip.clear();
                    return getAllTodoItems();
                })
                .catch(saveFailed);

            function saveFailed(error) {
                var msg = 'Save failed: ' +
                    breeze.saveErrorMessageService.getErrorMessage(error);
                error.message = msg;
                throw error; // for downstream callers to see
            }
        }

        function updateCounts() {
            var counts = datacontext.counts;
            counts.all = 0;
            counts.Added = 0;
            counts.Deleted = 0;
            counts.Modified = 0;
            counts.Unchanged = 0;
            manager.getEntities().forEach(countIt);

            function countIt(entity){
                var state = entity.entityAspect.entityState.name;
                counts[state] += 1;
                counts.all += 1;
            }
        }
    }
})();
