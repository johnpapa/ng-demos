(function () {
    'use strict';

    var app = angular.module('app.dashboard', ['app.core']);
    app.run(['$route', 'dashboard.routes', function($route, routes) {
        $route.routeStore = $route.routeStore.concat(routes);
    }]);
})();