(function () {
    'use strict';

    angular
        .module('app.attendees')
        .run(routeConfig);

    routeConfig.$inject = ['routehelper'];
    /* @ngInject */
    function routeConfig(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/attendees',
                config: {
                    templateUrl: 'app/attendee/attendees.html',
                    title: 'attendees',
                    settings: {
                        nav: 4,
                        content: '<i class="fa fa-group"></i> Attendees'
                    }
                }
            }
        ];
    }
})();