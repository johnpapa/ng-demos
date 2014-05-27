/*
 * SPAGHETTI CODE
 *
 * Pure example of making a controller do all the work and not delegating to dependencies.
 * We lose code reuse, make it difficult to test, difficult to maintain,
 * and increases the chances for introducing bugs since the code is duplicated.
 */

(function () {
    'use strict';
    var controllerId = 'avengers';
    angular.module('modularApp.avengers')
        .controller(controllerId, ['$http', '$log', '$q', '$rootScope', avengers]);

    function avengers($http, $log, $q, $rootScope) {
        var vm = this;
        vm.avengers = [];
        vm.maa = [];
        vm.title = 'Avengers';

        activate();

        function activate() {
            var promises = [getAvengersCast(), getMAA()];

            return $q.all(promises).then(function (eventArgs) {
                var data = { controllerId: controllerId };
                $rootScope.$broadcast('controller.activateSuccess', data);
                toastr.info('Activated Avengers View');
                $log.info('Activated Avengers View');
            });
        }

        function getMAA() {
            return $http.get('/api/maa')
                .then(function(data, status, headers, config) {
                    vm.maa = data.data[0].data.results;
                    return vm.maa;
                }, function(error){
                    toastr.error(error, title);
                    $log.error('Error: ' + error);
                });
        }

        function getAvengersCast() {
            var cast = [
                {name: 'Robert Downey Jr.', character: 'Tony Stark / Iron Man'},
                {name: 'Chris Hemsworth', character: 'Thor'},
                {name: 'Chris Evans', character: 'Steve Rogers / Captain America'},
                {name: 'Mark Ruffalo', character: 'Bruce Banner / The Hulk'},
                {name: 'Scarlett Johansson', character: 'Natasha Romanoff / Black Widow'},
                {name: 'Jeremy Renner', character: 'Clint Barton / Hawkeye'},
                {name: 'Gwyneth Paltrow', character: 'Pepper Potts'},
                {name: 'Samuel L. Jackson', character: 'Nick Fury'},
                {name: 'Paul Bettany', character: 'Jarvis'},
                {name: 'Tom Hiddleston', character: 'Loki'},
                {name: 'Clark Gregg', character: 'Agent Phil Coulson'}
            ];
            vm.avengers = cast;
            return $q.when(cast);
        }
    }
})();