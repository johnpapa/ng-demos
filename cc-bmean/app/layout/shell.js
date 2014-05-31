(function () {
    'use strict';

    var controllerId = 'shell';
    angular.module('app.layout').controller(controllerId,
        ['common', 'controllerActivator', shell]);

    function shell(common, controllerActivator) {
        var vm = this;
        var logger = common.logger;

        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;

        activate();

        function activate() {
            logger.success('CodeCamper loaded!', null);
            controllerActivator.activate([], controllerId).then(function () {
                hideSplash();
            });
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            common.$timeout(function () {
                vm.showSplash = false;
            }, 1000);
        }
    }
})();