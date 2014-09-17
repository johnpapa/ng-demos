/*
 * SPAGHETTI CODE
 *
 * Do not use this!
 * Use avengers.js instead.
 *
 * Pure example of making a controller do all the work and not delegating to dependencies.
 * We lose code reuse, make it difficult to test, difficult to maintain,
 * and increases the chances for introducing bugs since the code is duplicated.
 */

(function() {
    'use strict';

    angular
        .module('app.avengers')
        .controller('Avengers', ['$http', '$log', '$q', Avengers]);

    function Avengers($http, $log, $q) {
        /*jshint validthis: true */
        var vm = this;
        vm.avengers = [];
        vm.title = 'Avengers';

        activate();

        function activate() {
            var promises = [getAvengers()];
            return $q.all(promises).then(function (eventArgs) {
                toastr.info('Activated Avengers View');
                $log.info('Activated Avengers View');
            });
        }

        function getAvengers() {
            return $http.get('/api/maa')
                .then(function(data, status, headers, config) {
                    vm.avengers = data.data[0].data.results;
                    return vm.avengers;
                }, function(error){
                    toastr.error(error, title);
                    $log.error('Error: ' + error);
                });
        }
    }
})();
