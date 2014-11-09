(function() {
    'use strict';

    angular
        .module('app.bind-to-controller')
        .controller('BindTo', BindTo);

    /* @ngInject */
    function BindTo(dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = 'BindTo';

        vm.customers = [];
        vm.song = 'Counting Stars';
        vm.artist = 'One Republic';

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