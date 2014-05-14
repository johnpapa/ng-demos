(function () {
    'use strict';

    var app = angular.module('app', [
        // Angular modules
        'ngAnimate',
        'ngRoute',
        'ngSanitize',

        // Custom modules
        'common',
        'common.bootstrap',
        'common.exceptionHandler',

        // 3rd Party Modules
        'ui.bootstrap'
    ]);

    // Handle routing errors and success events
    app.run(['$route', function ($route) {
        // Include $route to kick start the router.
    }]);
})();