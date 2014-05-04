(function () {
    'use strict';

    var app = angular.module('app.core');

    app.constant('core.routes', []);

    app.config(['$routeProvider', 'core.routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {
        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }
})();