(function () {
    'use strict';

    var app = angular.module('app', [
        'app.core',
        'app.layout',
        'app.widgets'
    ]);

    // Handle routing errors and success events
    // trigger breeze configuration
    app.run(['appStart', function (appStart) {
            appStart.start();
        }]);
})();