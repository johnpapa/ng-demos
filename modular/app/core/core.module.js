(function () {
    'use strict';

    angular.module('modularApp.core', [
        'ngAnimate',
        'ngRoute',
        'ngSanitize',
        'common',
        'blocks.exception',
        'blocks.logger'
    ]);
})();