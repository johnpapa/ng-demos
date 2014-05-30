(function () {
    'use strict';

    var commonModule = angular.module('common');

    // Must configure the common service and set its
    // events via the commonConfigProvider
    commonModule.provider('commonConfig', function () {
        this.config = {
            // These are the properties we need to set
            //controllerActivateSuccessEvent: '',
        };

        this.$get = function () {
            return {
                config: this.config
            };
        };
    });
})();