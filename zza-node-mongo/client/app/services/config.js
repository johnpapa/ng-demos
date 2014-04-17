/*
 * Provides configuration values used widely in the app
 * Also configures 'toastr', the pop-up message component
 */
(function(angular) {
    'use strict';

    angular.module( "app" ).factory( 'config',
        ['$rootScope', factory] );

    function factory($rootScope) {
        // Configure toastr for this app
        // 2 second toast timeout
        toastr.options.timeOut       = 2000;
        toastr.options.positionClass = 'toast-bottom-right';

        return {
            version             : $rootScope.version = '0.8.0',
            debug               : true,
            httpTimeout         : 2500,
            server              : 'Express',
            serviceName         : 'breeze/zza',
            devServiceName      : 'breeze/Dev',
            productImageBasePath: 'images/products/',
            productUnknownImage : 'images/products/unknown.jpg',
            reportStateChanges  : true,
            userSessionId       : '0' //breeze.core.getUuid()
        };
    };

}( this.angular ));
