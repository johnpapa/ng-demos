(function () {
    'use strict';

    var app = angular.module('app.core', [
        // Angular modules
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)
        // Custom modules
        'common',           // common functions, logger, spinner
        'common.exceptionHandler', // exceptionHandler
    ]);
    app.run(['$route', 'core.routes', function($route, routes) {
        $route.routeStore = routes;
    }]);
})();