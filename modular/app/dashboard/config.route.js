(function () {
    'use strict';

    var app = angular.module('app.dashboard');

    app.run(['routehelper', function(routehelper){
        routehelper.configureRoutes(getRoutes());
    }]);

    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: '/app/dashboard/dashboard.html',
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