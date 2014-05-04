(function () {
    'use strict';

    var app = angular.module('modularApp.avengers', ['modularApp.core']);
    app.run(['$route', 'avengers.routes', function($route, routes){
        $route.routeStore = $route.routeStore.concat(routes);
    }]);
})();