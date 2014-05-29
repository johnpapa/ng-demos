(function () {
    'use strict';

    var app = angular.module('app.avengers');

    app.run(['routehelper', function(routehelper){
        routehelper.configureRoutes(getRoutes());
    }]);

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