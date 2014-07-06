(function () {
    'use strict';

    /* @ngInject */
    function Dashboard(common, dataservice) {
        var log = common.logger.info;

        /*jshint validthis: true */
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
            return dataservice.ready(promises).then(function(){
                log('Activated Dashboard View');
            });
        }

        function getAvengerCount() {
            return dataservice.getAvengerCount().then(function (data) {
                vm.avengerCount = data;
                return vm.avengerCount;
            });
        }

        function getAvengersCast() {
            return dataservice.getAvengersCast().then(function (data) {
                vm.avengers = data;
                return vm.avengers;
            });
        }
    }

//    Dashboard.$inject = ['common', 'dataservice'];

    angular
        .module('app.dashboard')
        .controller('Dashboard', Dashboard);
})();