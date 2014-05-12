/* logger: display color-coded messages in "toasts" and to console 
 * relies on Angular injector to provide:
 *     $log - Angular's console logging facility
 */
(function() {

    angular.module('app').factory('logger', [ '$log', function($log) {

        // This logger wraps the toastr logger and also logs to console using ng $log
        // toastr.js is library by John Papa that shows messages in pop up toast.
        // https://github.com/CodeSeven/toastr

        toastr.options.timeOut = 2000; // 2 second toast timeout
        toastr.options.positionClass = 'toast-bottom-right';

        var logger = {
            error: error,
            info: info,
            log: log,  // straight to console; bypass toast
            success: success,
            warning: warning
        };

        return logger;

        function error(message, title) {
            toastr.error(message, title);
            $log.error("Error: " + message);
        }

        function info(message, title) {
            toastr.info(message, title);
            $log.info("Info: " + message);
        }

        function log(message) {
            $log.log(message);
        }

        function success(message, title) {
            toastr.success(message, title);
            $log.info("Success: " + message);
        }

        function warning(message, title) {
            toastr.warning(message, title);
            $log.warn("Warning: " + message);
        }

    }]);

})();