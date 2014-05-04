(function () {
    'use strict';

    var app = angular.module('app.avengers', ['app.core']);
    app.run(['$route', 'avengers.routes', function($route, routes){
        $route.routeStore = $route.routeStore.concat(routes);
    }]);
})();