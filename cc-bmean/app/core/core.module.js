(function () {
    'use strict';

    angular.module('app.core', [
        'ngAnimate', 'ngRoute', 'ngSanitize',
        'common', 'common.bootstrap',
        'blocks.exception', 'blocks.logger',

        // 3rd Party Modules
        'ui.bootstrap',     // ui-bootstrap (ex: carousel, pagination, dialog)
        'breeze.angular',   // tells breeze to use $q instead of Q.js
        'breeze.directives',// breeze validation directive (zValidate)
        'ngplus',           // ngplus utilities
        'ngzWip'            // zStorage and zStorageWip
    ]);
})();