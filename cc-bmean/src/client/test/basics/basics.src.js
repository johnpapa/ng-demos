/* jscs: disable */
/*
 * Source for the "Basics" tests
 */

(function() {
    'use strict';

	/* Module */
    var basics = angular.module('basics', []);

	/* 'basicService' */

    basics.factory('calcService', calcService);

    // "factory" (AKA "service") to test
    // Depends upon the Angular $log service
    function calcService($log) {
        return {
            calc: calc
        };
        ///////////
        function calc(input, previousOutput){
            var inp =  +(input || 0);
            var prev = +(previousOutput || 0);
            var result = inp + prev;

            // use the dependency
            $log.debug('calc(' + input + ', ' + previousOutput + ') => '+ result);

            return result;
        }
    }

}());
/* jscs: enable */
