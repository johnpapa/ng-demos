(function () {
    'use strict';

    angular.module('app.core', [
        'ngAnimate', 'ngRoute', 'ngSanitize',
        'common',
        'blocks.exception', 'blocks.logger'
    ]);

})();