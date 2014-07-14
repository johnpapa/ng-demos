(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('Shell', Shell);

    Shell.$inject = ['common', 'config'];

    function Shell(common, config) {
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
//            Using a resolver on all routes or dataservice.ready in every controller
//            dataservice.ready().then(function(){
//                hideSplash();
//            });
            hideSplash();
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            common.$timeout(function () {
                vm.showSplash = false;
            }, 1000);
        }
    }
})();