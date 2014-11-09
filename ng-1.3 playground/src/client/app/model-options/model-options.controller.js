(function () {
    'use strict';

    angular
        .module('app.model-options')
        .controller('ModelOptions', ModelOptions);

    /* @ngInject */
    function ModelOptions(dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;

        vm.avengers;
        vm.title = 'ModelOptions';

        activate();

        function activate() {
            return getAvengers().then(function() {
                logger.info('Activated ModelOptions View');
            });
        }

        function getAvengers() {
            return dataservice.getAvengers().then(function (data) {
                vm.avengers = data;
                return vm.avengers;
            });
        }
    }
})();