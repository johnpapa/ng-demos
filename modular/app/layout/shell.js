(function () {
    'use strict';

    var controllerId = 'shell';
    angular.module('app.layout').controller(controllerId,
        ['common', 'config', shell]);

    function shell(common, config) {
        var vm = this;
        var logSuccess = common.logger.success;

        vm.title = config.appTitle;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;

        activate();

        function activate() {
            logSuccess(config.appTitle + ' loaded!', null);
            common.activateController([], controllerId).then(function(){
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