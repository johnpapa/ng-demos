(function () {
    'use strict';

    var app = angular.module('app.core');

    app.constant('core.routes',  getRoutes());

    app.config(['$routeProvider', 'core.routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {
        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: '/app/core/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            },
            {
                url: '/ping',
                config: {
                    template: '<section id="ping-view" class="mainbar" >PING</section>',
                    title: 'ping',
                    settings: {
                        nav: 3,
                        content: 'PING'
                    }
                }
            }
        ];
    }
})();