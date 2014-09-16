(function() {
    'use strict';

    angular
        .module('app.avengers')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'avengers',
                config: {
                    url: '/avengers',
                    templateUrl: 'app/avengers/avengers.html',
                    controller: 'Avengers',
                    controllerAs: 'vm',
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
