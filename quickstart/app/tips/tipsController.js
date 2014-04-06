(function () {
    'use strict';

    var controllerId = 'tipsController';

    angular.module('app')
        .controller(controllerId, ['tipsService', tipsController]);

    function tipsController(tipsService) {
        var vm = this;

        vm.activate = activate;
        vm.getTips = getTips;
        vm.isActive = isActive;
        vm.parks = [];
        vm.selectedPark = {};
        vm.title = 'Tips';

        activate();

        function activate() {
            return getTips();
        }

        function getTips(){
            return tipsService.getAllTips().then(function(data){
                vm.parks = data.data;
                return vm.parks;
            })
        }

        function isActive(park){
            return !!(vm.selectedPark === park);
        }
    }
})();