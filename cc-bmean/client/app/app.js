(function () {
    'use strict';

    angular.module('app', [
        /*
         * Order is not important. Angular makes a
         * pass to register all of the modules listed
         * and then when app.dashboard tries to use app.data,
         * it's components are available.
         */

        /*
         * Everybody has access to these
         */
        'app.core',
        'app.data', // needs core
        'app.widgets', // needs core

        /*
         * Feature areas
         */
        'app.attendees',
        'app.dashboard',
        'app.layout',
        'app.session',
        'app.speaker',
        'app.wip'
    ]);
})();