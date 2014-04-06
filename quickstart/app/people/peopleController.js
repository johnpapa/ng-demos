(function () {
    'use strict';

    var controllerId = 'peopleController';

    angular.module('app')
        .controller(controllerId, ['$scope', peopleController]);

    function peopleController($scope) {
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