(function () {
    'use strict';

    var controllerId = 'peopleControllerAs';

    angular.module('app')
        .controller(controllerId, ['peopleService', peopleControllerAs]);

    function peopleControllerAs(peopleService) {
        var vm = this;
        vm.title = 'People';
        vm.people = [];
        vm.activate = activate;

        activate();

        function activate() {
//            vm.people = [
//                {first: 'John', last: 'Papa'},
//                {first: 'Bob', last: 'Fields'},
//                {first: 'Brian', last: 'Clark'},
//                {first: 'Greg', last: 'Stewart'}
//            ];
            vm.people = peopleService.getAll();
        }
    }
})();