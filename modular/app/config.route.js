(function () {
    'use strict';

    var app = angular.module('modularApp');

    app.config(['$routeProvider', routeConfigurator]);
    function routeConfigurator($routeProvider) {
        var routes = [];
        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
    }

    app.run(['$route', function($route)  {
    }]);
})();