(function () {
    'use strict';

    var serviceId = 'tipsService';

    angular.module('app')
        .factory(serviceId, ['$http', tipsService]);

    function tipsService($http) {
        var service = {
            getAllTips: getAllTips
        };

        return service;

        function getAllTips() {
            //TODO: refactor to local service
            return $http({method: 'GET', url: 'http://meantest.azurewebsites.net/tips/'}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    return data;
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
    }
})();