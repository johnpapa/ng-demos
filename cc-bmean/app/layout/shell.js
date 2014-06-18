(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('shell', ['common', 'datacontext', shell]);

    function shell(common, datacontext) {
        /*jshint validthis: true */
        var vm = this;

        var logger = common.logger;

        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;

        activate();

        function activate() {
            logger.success('CodeCamper loaded!', null);
            datacontext.ready([]).then(hideSplash());
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            common.$timeout(function () {
                vm.showSplash = false;
            }, 1000);
        }
    }
})();