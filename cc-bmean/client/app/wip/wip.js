(function () {
    'use strict';

    function WIP($scope, $location, bsDialog, config, datacontext) {
        /*jshint validthis: true */
        var vm = this;

        vm.cancelAllWip = cancelAllWip;
        vm.gotoWip = gotoWip;
        vm.predicate = '';
        vm.reverse = false;
        vm.setSort = setSort;
        vm.title = 'Work in Progress';
        vm.wip = [];

        activate();

        function activate() {
            datacontext.ready([getWipSummary()]);

            $scope.$on(config.events.storage.wipChanged, function (event, data) {
                vm.wip = data;
            });
        }

        function cancelAllWip() {
            vm.isDeleting = true;

            return bsDialog.deleteDialog('Work in Progress')
                .then(confirmDelete, cancelDelete);

            function cancelDelete() {
                vm.isDeleting = false;
            }

            function confirmDelete() {
                datacontext.zStorageWip.clearAllWip();
                vm.isDeleting = false;
            }
        }

        function getWipSummary() {
            vm.wip = datacontext.zStorageWip.getWipSummary();
        }

        function gotoWip(wipData) {
            $location.path('/' + wipData.routeState + '/' + wipData.key);
        }

        function setSort(prop) {
            vm.predicate = prop;
            vm.reverse = !vm.reverse;
        }
    }

    WIP.$inject = ['$scope', '$location', 'bootstrap.dialog', 'config', 'datacontext'];

    angular
        .module('app')
        .controller('WIP', WIP);
})();