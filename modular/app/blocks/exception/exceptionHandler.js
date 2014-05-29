// Include in index.html so that app level exceptions are handled.
// Exclude from testRunner.html which should run exactly what it wants to run
(function (angular) {
    'use strict';

    var exceptionModule = angular.module('blocks.exception');

    // Must configure the service and set its
    // events via the exceptionConfigProvider
    exceptionModule.provider('exceptionConfig', function () {
        this.config = {
            // These are the properties we need to set
            //appErrorPrefix: ''
        };

        this.$get = function () {
            return {
                config: this.config
            };
        };
    });

    // Configure by setting an optional string value for appErrorPrefix.
    // Accessible via config.appErrorPrefix (via config value).
    exceptionModule.config(['$provide', function ($provide) {
        $provide.decorator('$exceptionHandler',
            ['$delegate', 'exceptionConfig', 'logger',
                extendExceptionHandler]);
    }]);

    // Extend the $exceptionHandler service to also display a toast.
    function extendExceptionHandler($delegate, exceptionConfig, logger) {
        var appErrorPrefix = exceptionConfig.config.appErrorPrefix || '';
        return function (exception, cause) {
            $delegate(exception, cause);
            var errorData = { exception: exception, cause: cause };
            var msg = appErrorPrefix + exception.message;
            logger.error(msg, errorData);
        };
    }
})(this.angular);