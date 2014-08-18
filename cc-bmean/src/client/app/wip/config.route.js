(function () {
    'use strict';

    angular.module('app.wip')
        .run(routeConfig);

    routeConfig.$inject = ['routehelper'];
    /* @ngInject */
    function routeConfig(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/workinprogress',
                config: {
                    templateUrl: 'app/wip/wip.html',
                    title: 'workinprogress',
                    settings: {
                        content: '<i class="fa fa-asterisk"></i> Work In Progress'
                    }
                }
            }
        ];
    }
})();