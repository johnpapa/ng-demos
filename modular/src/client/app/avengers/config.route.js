(function() {
    'use strict';

    angular
        .module('app.avengers')
        .run(appRun);

    // appRun.$inject = ['routehelper']

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureStates(getStates());
    }

    function getStates() {
    // .state('state1.list', {
    //     url: "/list",
    //     templateUrl: "partials/state1.list.html",
    //     controller: function($scope) {
    //         $scope.items = ["A", "List", "Of", "Items"];
    //     }
    // })
        return [
            {
                state: 'avengers',
                config: {
                    url: '/avengers',
                    templateUrl: 'app/avengers/avengers.html',
                    controller: 'Avengers',
                    controllerAs: 'vm',
                    title: 'avengers',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Avengers'
                    }
                }
            }
        ];
    }
})();
