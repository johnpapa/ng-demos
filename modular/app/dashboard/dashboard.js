(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app.dashboard').controller(controllerId, ['common', 'avengers.dataservice', dashboard]);

    function dashboard(common, avengersData) {
        var log = common.logger.info;

        var vm = this;
        vm.news = {
            title: 'Marvel Avengers',
            description: 'Marvel Avengers 2 is now in production!'
        };
        vm.avengerCount = 0;
        vm.avengers = [];
        vm.title = 'Dashboard';

        activate();

        function activate() {
            var promises = [getAvengerCount(), getAvengersCast()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard View'); });
        }

        function getAvengerCount() {
            return avengersData.getAvengerCount().then(function (data) {
                vm.avengerCount = data;
                return vm.avengerCount;
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