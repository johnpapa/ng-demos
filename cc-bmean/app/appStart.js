(function () {
    'use strict';

    var app = angular.module('app')
        .factory('appStart', ['routeMediator', appStart]);

    function appStart(routeMediator) {
        var service = {
            start: start
        };

        return service;

        function start(){
            routeMediator.setRoutingEventHandlers();
        }
    }
}());