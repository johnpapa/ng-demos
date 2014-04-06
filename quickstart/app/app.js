    (function () {
        'use strict';

        // TODO: Inject modules as needed.
        var app = angular.module('app', [
            // Angular modules
            'ngAnimate',        // animations
            'ngRoute'           // routing

            // Custom modules

            // 3rd Party Modules

        ]);

        app.config(['$routeProvider', function($routeProvider){
            $routeProvider
                .when('/',{ templateUrl: 'app/people/people.html', title: 'people'})
                .when('/tips',{ templateUrl: 'app/tips/tips.html', title: 'tips'})
                .otherwise({ redirectTo: '/' });
        }]);

        // Execute bootstrapping code and any dependencies.
        // TODO: inject services as needed.
        app.run(['$rootScope',
            function ($rootScope) {

            }]);
    })();