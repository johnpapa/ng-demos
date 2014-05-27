(function () {
    'use strict';

    var app = angular.module('app', [
        // Angular modules
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)

        // Custom modules
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions
        'common.exceptionHandler', // exceptionHandler

        // 3rd Party Modules
        'ui.bootstrap',     // ui-bootstrap (ex: carousel, pagination, dialog)
        'breeze.angular', // tells breeze to use $q instead of Q.js
        'breeze.directives', // breeze validation directive (zValidate)
        'ngplus',           // ngplus utilities
        'ngzWip'            // zStorage and zStorageWip
    ]);

    // Handle routing errors and success events
    // trigger breeze configuration
    app.run(['appStart', function (appStart) {
            appStart.start();
        }]);
})();