(function () {
    'use strict';

    angular
        .module('app.session')
        .run(['routehelper', function(routehelper){
            routehelper.configureRoutes(getRoutes());
        }]);

    function getRoutes() {
        return [
            {
                url: '/sessions',
                config: {
                    title: 'sessions',
                    templateUrl: 'app/session/sessions.html',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-calendar"></i> Sessions'
                    }
                }
            },
            {
                url: '/sessions/search/:search',
                config: {
                    title: 'sessions-search',
                    templateUrl: 'app/session/sessions.html',
                    settings: {}
                }
            },
            {
                url: '/session/:id',
                config: {
                    templateUrl: 'app/session/sessiondetail.html',
                    title: 'session',
                    settings: { }
                }
            }
        ];
    }
})();