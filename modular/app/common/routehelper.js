(function () {
    'use strict';

    var common = angular.module('common');

    // Must configure via the routehelperConfigProvider
    common.provider('routehelperConfig', function () {
        this.config = {
            // These are the properties we need to set
            // $routeProvider: undefined
        };

        this.$get = function () {
            return {
                config: this.config
            };
        };
    });

    common.factory('routehelper', ['$route', 'routehelperConfig', routehelper]);

    function routehelper($route, routehelperConfig) {
        var routes = [];
        var $routeProvider = routehelperConfig.config.$routeProvider;

        var service = {
            configureRoutes: configureRoutes,
            getRoutes: getRoutes
        };

        return service;

        function configureRoutes(routes){
//            var routes = getRoutes();
            routes.forEach(function (route) {
                $routeProvider.when(route.url, route.config);
            });
            $routeProvider.otherwise({ redirectTo: '/' });
        }

//        Object.defineProperty(service, 'routes', {
//            get: function() {
//                for (var item in $route){
//                    if ($route.hasOwnProperty(prop)) {
//                        var route = $route[item];
//                        var isRoute = !!route.title;
//                        if (isRoute) {
//                            _routes.push(route);
//                        }
//                    }
//                }
//
//                return _routes;
//            }
//        });

        function getRoutes() {
            for (var prop in $route.routes) {
                if ($route.routes.hasOwnProperty(prop)) {
                    var route = $route.routes[prop];
                    var isRoute = !!route.title;
                    if (isRoute) {
                        routes.push(route);
                    }
                }
            }
            return routes;
        }
    }
})();