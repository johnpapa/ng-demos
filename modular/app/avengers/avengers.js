(function () {
    'use strict';
    var controllerId = 'avengers';
    angular.module('app.avengers')
        .controller(controllerId,
            ['common', 'avengers.dataservice', avengers]);

    function avengers(common, avengersData) {
        var log = common.logger.info;

        var vm = this;
        vm.avengers = [];
        vm.maa = [];
        vm.title = 'Avengers';

        activate();

        function activate() {
            var promises = [getAvengersCast(), getMAA()];
            common.activateController(promises, controllerId)
                .then(function () {
                    log('Activated Avengers View');
                });
        }

        function getMAA() {
            avengersData.getMAA()
                .then(function (data) {
                    vm.maa = data;
                    return vm.maa;
                });
        }

        function getAvengersCast() {
            return avengersData.getAvengersCast().then(function (data) {
                vm.avengers = data;
                return vm.avengers;
            });
        }
    }
})();