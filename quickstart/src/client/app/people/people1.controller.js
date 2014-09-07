(function () {
    'use strict';

    angular
        .module('app')
        .controller('PeopleCtrl', PeopleCtrl);

    PeopleCtrl.$inject = ['$scope'];

    function PeopleCtrl($scope) {
        $scope.title = 'People';
        $scope.people = [];
        $scope.activate = activate;

        activate();

        function activate() {
            $scope.people = [
                {first: 'John', last: 'Papa'},
                {first: 'John', last: 'Smith'},
                {first: 'Troy', last: 'Hamilton'},
                {first: 'Anthony', last: 'Tornatore'}
            ];
        }
    }
})();