(function () {
    'use strict';

    var serviceId = 'peopleService';

    angular.module('app')
        .factory(serviceId, [peopleService]);

    function peopleService() {
        var service = {
            getAll: getAll
        };

        return service;

        function getAll() {
            return [
                {first: 'John', last: 'Papa', lunchMoney: 58.1234},
                {first: 'John', last: 'Smith', lunchMoney: 8.34},
                {first: 'Troy', last: 'Hamilton', lunchMoney: 18.747},
                {first: 'Anthony', last: 'Tornatore', lunchMoney: 38.4},
                {first: 'Pam', last: 'Dale', lunchMoney: 4.003}
            ];

        }
    }
})();