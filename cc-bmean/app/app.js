(function () {
    'use strict';

    var app = angular.module('app', [
        'app.core',
        'app.data',

        'app.layout',
        'app.widgets',
        'app.dashboard',
        'app.attendees',
        'app.session',
        'app.speaker',
        'app.wip'
    ]);

    // Handle routing errors and success events
    // trigger breeze configuration
    app.run(['appStart', function (appStart) {
            appStart.start();
        }]);
})();