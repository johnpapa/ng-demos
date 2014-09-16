(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .run(appRun);

    // appRun.$inject = ['routehelper'];

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureStates(getStates(), 'dashboard');
    }

    function getStates() {
        return [
            {
                state: 'dashboard',
                config: {
                    url: '/dashboard',
                    templateUrl: 'app/dashboard/dashboard.html',
                    controller: 'Dashboard',
                    controllerAs: 'vm',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }
        ];
    }
})();
