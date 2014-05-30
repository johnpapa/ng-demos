(function () {
    'use strict';

    var app = angular.module('app')
        .factory('appStart', ['datacontext', 'routeMediator', appStart]);

    function appStart(datacontext, routeMediator) {
        var service = {
            start: start
        };

        return service;

        function start(){
            datacontext.prime();
            routeMediator.init();
        }
    }
}());