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
                url: '/bind-once',
                config: {
                    templateUrl: 'app/bind-once/bind-once.html',
                    controller: 'BindOnce',
                    controllerAs: 'vm',
                    title: 'bind-once',
                    settings: {
                        nav: 2,
                        content: 'Bind Once'
                    }
                }
            }
        ];
    }
})();
