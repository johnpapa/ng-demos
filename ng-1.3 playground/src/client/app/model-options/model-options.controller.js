(function () {
    'use strict';

    angular
        .module('app.model-options')
        .controller('ModelOptions', ModelOptions);

    /* @ngInject */
    function ModelOptions($scope, dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;

        vm.avengers;
        vm.msg = {
            debounce: 'Filter is debounced as you type. Immediate on blur.',
            rollback: 'Input is debounced by 5000 ms. Click the rollback button to reset to model'
        };
        vm.modelOptions = {
            filter: {
                updateOn: 'default blur', 
                debounce: {
                    'default': 2000, 
                    'blur': 0
                }
            },
            repeat: {
                updateOn: 'blur', 
                debounce: 1000
            }
        };
        vm.rollback = rollback;
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

        function rollback() {
            $scope.modelOptionsForm.avengerName.$rollbackViewValue();
        }
    }
})();