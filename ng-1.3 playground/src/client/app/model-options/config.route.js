(function() {
    'use strict';

    angular
        .module('app.model-options')
        .run(appRun);

    // appRun.$inject = ['routehelper']

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/model-options',
                config: {
                    templateUrl: 'app/model-options/model-options.html',
                    controller: 'ModelOptions',
                    controllerAs: 'vm',
                    title: 'model-options',
                    settings: {
                        nav: 4,
                        content: 'Model Options'
                    }
                }
            }
        ];
    }
})();
