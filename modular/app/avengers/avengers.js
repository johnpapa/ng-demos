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
        vm.title = 'Avengers';

        activate();

        function activate() {
            var promises = [getAvengers()];
            controllerActivator.activate(promises, controllerId)
                .then(function () {
                    log('Activated Avengers View');
                });
        }

        function getAvengers() {
            dataservice.getAvengers()
                .then(function (data) {
                    vm.avengers = data;
                    return vm.avengers;
                });
        }
    }
})();