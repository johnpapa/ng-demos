(function () {
    'use strict';

    var controllerId = 'shell';
    angular.module('app').controller(controllerId,
        ['$rootScope', 'common', 'config', shell]);

    function shell($rootScope, common, config) {
        var vm = this;
        var logger = common.logger;
        var events = config.events;

        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;
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
        vm.useSpinner = (config.busyIndicator === 'spinner');

        activate();

        function activate() {
            logger.success('CodeCamper loaded!', null);
            common.activateController([], controllerId).then(function () {
                hideSplash();
            });
            listenForEvents();
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            common.$timeout(function () {
                vm.showSplash = false;
            }, 1000);
        }

        function toggleSpinner(on) {
            vm.isBusy = on;
        }

        function listenForEvents() {
            if (vm.useSpinner) {
                $rootScope.$on('$routeChangeStart',
                    function (event, next, current) {
                        toggleSpinner(true);
                    }
                );

                $rootScope.$on(events.controllerActivateSuccess,
                    function (data) {
                        toggleSpinner(false);
                    }
                );

                $rootScope.$on(events.spinnerToggle,
                    function (data) {
                        toggleSpinner(data.show);
                    }
                );
            }
        }
    }
})();