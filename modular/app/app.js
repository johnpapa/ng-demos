(function () {
    'use strict';

    var app = angular.module('modularApp', [
        'modularApp.avengers',
        'modularApp.dashboard',
        'modularApp.layout',
        'modularApp.widgets'
    ]);
})();