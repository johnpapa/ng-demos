/*
 * Service to reset the demo database to a "pristine" state
 * Also adds "state-change" reporting for debugging during development
 */
(function(angular) {
    'use strict';

    angular.module( "app" ).factory( 'databaseReset', factory );

    function factory ( $http, $q, config ) {
        return { reset: reset };
        /////////////////////
        function reset() {
            var deferred = $q.defer();

            //See http://docs.angularjs.org/api/ng.$http
            return $http.post(config.devServiceName + '/reset')
                 .success(success)
                 .error(fail);

            return deferred.promise;

            // ***********************************
            // Internal Handlers
            // ***********************************

            function success(data) {
                deferred.resolve("Database reset succeeded with message: " + data);
            }

            function fail(data, status) {
                deferred.reject( getMessage(data, status) );
            }
        }

        function getMessage(data, status) {
            var message = "Database reset failed (" + status + ")";
            if (data) {
                try {
                    data = JSON.parse(data).Message;
                } finally {
                    message += "\n" + data;
                }
            }
            return message;
        }

    };

}( this.angular ));
