(function () {
    'use strict';

    angular
        .module('app')
        .controller('TipsCtrl', TipsCtrl);

    TipsCtrl.$inject = ['tipsService'];

    function TipsCtrl(tipsService) {
        /* jshint validthis: true */
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
            });
        }

        function isActive(park){
            return !!(vm.selectedPark === park);
        }
    }
})();