/*
 * page - the controller for the page view
 */
(function() {
    'use strict';
    angular.module('app').controller('pageController',
        ['$scope', '$timeout', 'config', 'datacontext', 'wip-service', controller]);

    function controller($scope, $timeout, config, datacontext, wip) {
        var vm = this;
        vm.appTitle = config.appTitle;
        vm.clearErrorLog = clearErrorLog;
        vm.errorLog = [];
        vm.isBusy = true;
        vm.newItemText = '';
        vm.serverTitle = config.serverTitle;
        vm.syncDisabled = syncDisabled;
        vm.showCompleted = false;
        vm.showDeleted = false;
        vm.todos = [];
        vm.wipMessages = [];

        var wipMsgCount = 0;
        reportWipMessages();
        datacontext.ready().then(onReady).catch(handleError);

        function onReady(){
            // members that depend on a ready datacontext
            vm.addItem = addItem;
            vm.counts = datacontext.counts;
            vm.deleteItem = deleteItem;
            vm.itemsFilter = itemsFilter;
            vm.refresh = refresh;
            vm.reset = reset;
            vm.sync = sync;

            loadTodoItems(); // initial data load          
        }

        ////////////////////////////
        function addItem() {
            if (vm.newItemText !== '') {
                var newTodo = datacontext.addTodoItem({ text: vm.newItemText});
                vm.todos.unshift(newTodo);
                vm.newItemText='';
            }
        }

        function clearErrorLog() { vm.errorLog = [];}

        function deleteItem(todoItem){
            datacontext.deleteTodoItem(todoItem);
            if (todoItem.entityAspect.entityState.isDetached()){
                // remove from the list if became detached
                var ix = vm.todos.indexOf(todoItem);
                if (ix > -1) { vm.todos.splice(ix,1); }
            }
        }





        function getAllTodoItems() {
            vm.isBusy = true;
            // Controller has no knowledge of how data
            // is retrieved nor that Breeze is involved.
            return datacontext.getAllTodoItems()
                .then(querySuccess, handleError);
        }



        function handleError(error) {
            vm.isBusy = false;  
            var err = typeof error === 'string'? error : error.message;
            vm.errorLog.push((vm.errorLog.length+1) + ': ' + 
                (err || 'unknown error'));
        }

        function itemsFilter(todoItem) {
            // Beware: this is called a lot!
            var state = todoItem.entityAspect.entityState;
            return !state.isDetached() &&
                (!state.isDeleted() || vm.showDeleted)  &&
                (!todoItem.complete || vm.showCompleted);
        }

        function loadTodoItems(){
            vm.isBusy = true;
            return datacontext.loadTodoItems()
            .then(querySuccess, handleError);
        }

        function querySuccess(todoItems){
            vm.isBusy = false;   
            vm.todos = todoItems;
        }

        function refresh(){
            addItem();  // might have one pending
            return getAllTodoItems();
        }

        function reportWipMessages(){
            $scope.$on(wip.eventName(), function(event, message){
                vm.wipMessages.push((wipMsgCount+=1)+' - '+message);
                $timeout(function(){vm.wipMessages.length=0;}, 8000);
            })
        }

        function reset(){
            vm.isBusy = true;
            vm.newItemText='';
            return datacontext.reset().then(querySuccess, handleError);
        }

        function sync(){
            addItem(); // might have one pending
            vm.isBusy = true;
            return datacontext.sync().then(querySuccess, handleError);
        }

        function syncDisabled(){
            return vm.isBusy;
        }
    }
})();