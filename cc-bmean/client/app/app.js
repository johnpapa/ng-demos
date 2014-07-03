(function () {
    'use strict';

    angular.module('app', [
        /*
         * Everybody has access to these 3.
         */
        'app.core',
        'app.data', // needs core
        'app.widgets', // needs data and core

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