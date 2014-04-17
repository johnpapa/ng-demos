(function(angular) {

    'use strict';
    /**
     * @appConfigDecorator module
     * @name appConfigDecorator
     * @description
     *
     * # appConfigDecorator
     *
     * Adjusts config.js values for the test environment
     *
     * Most important are the service names which, if used, must
     * go to a different origin than the karma
     *
     */
    angular.module('appConfigDecorator', ['app']).config(['$provide',decorate]);

    function decorate($provide){
        $provide.decorator('config', appConfigDecorator);
    }

    function appConfigDecorator($delegate) {
        //  original config values are something like this:
        //      serviceName    : 'breeze/zza',
        //      devServiceName : 'breeze/Dev',
        $delegate.serviceName    = testFns.serviceBase + $delegate.serviceName;
        $delegate.devServiceName = testFns.serviceBase + $delegate.devServiceName;
        return $delegate;
    }

})(window.angular);
