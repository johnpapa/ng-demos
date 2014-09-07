    (function () {
        'use strict';

        angular
            .module('app', ['ngAnimate', 'ngRoute'])
            .config(routeConfig);
        
        routeConfig.$inject = ['$routeProvider'];

        function routeConfig($routeProvider) {
            $routeProvider
                .when('/',{ templateUrl: 'app/people/people.html', title: 'people'})
                .when('/avengers',{ templateUrl: 'app/avengers/avengers.html', title: 'avengers'})
                .otherwise({ redirectTo: '/' });
        }
    })();