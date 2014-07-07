(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('Shell', Shell);

    Shell.$inject = ['common', 'config', 'dataservice'];

    function Shell(common, config, dataservice) {
        /*jshint validthis: true */
        var vm = this;
        var logSuccess = common.logger.success;

        vm.title = config.appTitle;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;

        activate();

        function activate() {
            logSuccess(config.appTitle + ' loaded!', null);
            dataservice.ready().then(function(){
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