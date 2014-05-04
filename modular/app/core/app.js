(function () {
    'use strict';

    var app = angular.module('app.core', [
        'ngAnimate',
        'ngRoute',
        'ngSanitize',
        'common',
        'common.exceptionHandler'
    ]);
    app.run(['$route', 'core.routes', function($route, routes) {
        $route.routeStore = routes;
    }]);
})();