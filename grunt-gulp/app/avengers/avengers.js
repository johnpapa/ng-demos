(function () {
    'use strict';
    var controllerId = 'avengers';
    angular.module('app')
        .controller(controllerId,
            ['common', 'datacontext', avengers]);

    function avengers(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.avengers = [];
        vm.maa = [];
        vm.title = 'Avengers';

        activate();

        function activate() {
            var promises = [getAvengersCast(), getMAA()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Avengers View'); });
        }

        function getMAA(){
            return datacontext.getMAA().then(function(data){
//                vm.maa = data.data[0].data.results;
                    vm.maa = data;
                return vm.maa;
            })
        }

        function getAvengersCast() {
            return datacontext.getAvengersCast().then(function (data) {
                return vm.avengers = data;
            });
        }
    }
})();