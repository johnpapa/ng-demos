(function () {
    'use strict';

    angular.module('app.wip')
        .run(['routehelper', function(routehelper){
            routehelper.configureRoutes(getRoutes());
        }]);

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