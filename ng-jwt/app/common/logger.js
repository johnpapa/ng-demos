(function(angular) {
    'use strict';

    angular.module('common').factory('logger',
        ['$log', factory ] );

    function factory( $log ) {
        var logger = {
            source: '',
            showToasts: true,

            error   : error,
            info    : info,
            success : success,
            warning : warning,

            // straight to console; bypass toastr
            log     : $log.log
        };

        return logger;
        /////////////////////
        function error(message, title) {
            if(logger.showToasts) { toastr.error(message, title); }
            $log.error(logger.source + ' Error: ' + message);
        }

        function info(message, title) {
            if(logger.showToasts) { toastr.info(message, title); }
            $log.info(logger.source + ' Info: ' + message);
        }

        function success(message, title) {
            if(logger.showToasts) { toastr.success(message, title); }
            $log.info(logger.source + ' Success: ' + message);
        }

        function warning(message, title) {
            if(logger.showToasts) { toastr.warning(message, title); }
            $log.warn(logger.source + ' Warning: ' + message);
        }
    }
}( this.angular ));