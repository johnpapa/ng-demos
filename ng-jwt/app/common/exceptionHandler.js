// Include in index.html so that app level exceptions are handled.
// Exclude from testRunner.html which should run exactly what it wants to run
(function (angular) {
    'use strict';

    var commonEH = angular.module('common.exceptionHandler', []);

    // Must configure the common service and set its
    // events via the exceptionConfigProvider
    commonEH.provider('exceptionConfig', function () {
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

    commonEH.config(['$provide', function ($provide) {
        $provide.decorator('$exceptionHandler',
            ['$delegate', 'exceptionConfig', 'logger', extendExceptionHandler]);
    }]);

    // Extend the $exceptionHandler service to also display a toast.
    function extendExceptionHandler($delegate, exceptionConfig, logger) {
        logger.source = exceptionConfig.appErrorPrefix || '';
        return function (exception, cause) {
            $delegate(exception, cause);
            if (logger.source && exception.message.indexOf(logger.source) === 0) { return; }

            var errorData = { exception: exception, cause: cause };
            var msg = logger.source + exception.message;
            logger.error(msg, errorData, true);
        };
    }
})(this.angular);