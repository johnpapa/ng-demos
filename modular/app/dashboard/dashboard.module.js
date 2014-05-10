(function () {
    'use strict';

    var app = angular.module('modularApp.dashboard',
        ['modularApp.core', 'modularApp.avengers']
    );

    app.run(['$route', 'dashboard.routes', function($route, routes) {
        $route.routeStore = $route.routeStore.concat(routes);
    }]);
})();