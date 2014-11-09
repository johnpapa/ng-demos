(function() {
    'use strict';

    angular
        .module('app.bind-once')
        .run(appRun);

    // appRun.$inject = ['routehelper']

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/q',
                config: {
                    templateUrl: 'app/other/q.html',
                    controller: 'Q',
                    controllerAs: 'vm',
                    title: 'q',
                    settings: {
                        nav: 5,
                        content: 'Q'
                    }
                }
            }
        ];
    }
})();
