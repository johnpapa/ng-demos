(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('Shell', Shell);

    Shell.$inject = ['common', 'datacontext'];

    function Shell(common, datacontext) {
        /*jshint validthis: true */
        var vm = this;

        var logger = common.logger;

        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;

        activate();

        function activate() {
            logger.success('CodeCamper loaded!', null);
//            TODO: Using a resolver on all routes or datacontext.ready in every controller
//            return datacontext.ready([]).then(hideSplash);
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