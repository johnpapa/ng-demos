(function () {
    'use strict';

    var app = angular.module('app.avengers');

    app.constant('avengers.routes', getRoutes());
    app.config(['$routeProvider', 'avengers.routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {
        routes.forEach(function (r) {
            $routeProvider.when(r.url, r.config);
        });
    }

    function getRoutes() {
        return [
            {
                url: '/avengers',
                config: {
                    templateUrl: 'app/avengers/avengers.html',
                    title: 'avengers',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Avengers'
                    }
                }
            }
        ];
    }
})();