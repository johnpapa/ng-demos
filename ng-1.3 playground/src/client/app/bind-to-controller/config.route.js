(function() {
    'use strict';

    angular
        .module('app.bind-to-controller')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/btc',
                config: {
                    templateUrl: 'app/bind-to-controller/music.html',
                    controller: 'Music',
                    controllerAs: 'vm',
                    title: 'bind to controller',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-music"></i> Bind to Controller'
                    }
                }
            }
        ];
    }
})();
