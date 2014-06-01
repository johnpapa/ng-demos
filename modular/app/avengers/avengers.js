(function () {
    'use strict';
    var controllerId = 'avengers';
    angular.module('app.avengers')
        .controller(controllerId,
            ['common', 'controllerActivator', 'dataservice', avengers]);

    function avengers(common, controllerActivator, dataservice) {
        var log = common.logger.info;

        var vm = this;
        vm.avengers = [];
        vm.maa = [];
        vm.title = 'Avengers';

        activate();

        function activate() {
            var promises = [getAvengersCast(), getMAA()];
            controllerActivator.activate(promises, controllerId)
                .then(function () {
                    log('Activated Avengers View');
                });
        }

        function getMAA() {
            dataservice.getMAA()
                .then(function (data) {
                    vm.maa = data;
                    return vm.maa;
                });
        }

        function getAvengersCast() {
            return dataservice.getAvengersCast().then(function (data) {
                vm.avengers = data;
                return vm.avengers;
            });
        }
    }
})();