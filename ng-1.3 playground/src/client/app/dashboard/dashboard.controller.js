(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('Dashboard', Dashboard);

    /* @ngInject */
    function Dashboard(logger) {
        /*jshint validthis: true */
        var vm = this;

        vm.title = 'Dashboard';

        activate();

        function activate() {
            logger.info('Activated Dashboard View');
        }
    }
})();
