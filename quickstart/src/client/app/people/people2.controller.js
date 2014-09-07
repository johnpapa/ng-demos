(function () {
    'use strict';

    angular
        .module('app')
        .controller('PeopleCtrlAs', PeopleCtrlAs);

    PeopleCtrlAs.$inject = ['peopleService'];

    function PeopleCtrlAs(peopleService) {
        /* jshint validthis:true */
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