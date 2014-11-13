(function() {
    'use strict';

    angular
        .module('app.bind-to-controller')
        .controller('BindTo', BindTo);

    /* @ngInject */
    function BindTo(dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = 'BindToController';

        vm.customers = [];
        vm.msg = 'Person directive binds its isolate scope to its \
            directive controller. Tap the name and the details should \
            appear, when bindToController = true';

        activate();

        function activate() {
            return getCustomers().then(function() {
	            logger.info('Activated Bind-to-Controller View');
	        });
        }

        function getCustomers() {
            return dataservice.getCustomers().then(function (data) {
                vm.customers = data;
                return vm.customers;
            });
        }
    }
})();