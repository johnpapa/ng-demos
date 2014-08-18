(function () {
    'use strict';

    angular.module('app.speaker')
        .run(routeConfig);

    routeConfig.$inject = ['routehelper'];
    /* @ngInject */
    function routeConfig(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/speaker/:id',
                config: {
                    templateUrl: 'app/speaker/speakerdetail.html',
                    title: 'speaker',
                    settings: {}
                }
            },
            {
                url: '/speakers',
                config: {
                    templateUrl: 'app/speaker/speakers.html',
                    title: 'speakers',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-user"></i> Speakers'
                    }
                }
            }
        ];
    }
})();