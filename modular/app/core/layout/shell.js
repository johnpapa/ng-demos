(function () {
    'use strict';

    var controllerId = 'shell';
    angular.module('app.core').controller(controllerId,
        ['$rootScope', 'common', 'config', shell]);

    function shell($rootScope, common, config) {
        var vm = this;
        var logSuccess = common.logger.success;
        var events = config.events;
        vm.title = config.appTitle;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.spinnerOptions = {
            radius: 40,
            lines: 7,
            length: 0,
            width: 30,
            speed: 1.7,
            corners: 1.0,
            trail: 100,
            color: '#F58A00'
        };

        activate();

        function activate() {
            logSuccess(config.appTitle + ' loaded!', null);
            common.activateController([], controllerId);
        }

        function toggleSpinner(on) { vm.isBusy = on; }

//        $rootScope.$on('$routeChangeStart',
//            function (event, next, current) { toggleSpinner(true); }
//        );

        $rootScope.$on(events.controllerActivateSuccess,
            function (data) { toggleSpinner(false); }
        );

        $rootScope.$on(events.spinnerToggle,
            function (data) { toggleSpinner(data.show); }
        );
    }
})();