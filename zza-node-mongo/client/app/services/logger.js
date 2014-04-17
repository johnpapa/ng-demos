/*
 * Semantic logging service that passes messages both to
 * toastr (pop-up messages) and the console (via Angular's $log)
 *
 * toastr.js is library by John Papa that shows messages in pop up toast.
 * @see https://github.com/CodeSeven/toastr
 */
(function(angular) {
    'use strict';

    angular.module( "app" ).factory( 'logger',
        ['$log', factory ] );

    function factory( $log ) {
        return {
            error   : error,
            info    : info,
            success : success,
            warning : warning,

            // straight to console; bypass toast
            log     : $log.log
        };
        /////////////////////
        function error(message, title) {
            toastr.error(message, title);
            $log.error("Error: " + message);
        }

        function info(message, title) {
            toastr.info(message, title);
            $log.info("Info: " + message);
        }

        function success(message, title) {
            toastr.success(message, title);
            $log.info("Success: " + message);
        }

        function warning(message, title) {
            toastr.warning(message, title);
            $log.warn("Warning: " + message);
        }

    };

}( this.angular ));
