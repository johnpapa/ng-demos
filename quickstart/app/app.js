    (function () {
        'use strict';

        angular
            .module('app', ['ngAnimate', 'ngRoute'])
            .config(routeConfig);
        
        routeConfig.$inject = ['$routeProvider'];

        function routeConfig($routeProvider) {
            $routeProvider
                .when('/',{ templateUrl: 'app/people/people.html', title: 'people'})
                .when('/tips',{ templateUrl: 'app/tips/tips.html', title: 'tips'})
                .otherwise({ redirectTo: '/' });
        }
    })();