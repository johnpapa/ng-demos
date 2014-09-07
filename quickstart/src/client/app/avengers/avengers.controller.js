(function () {
    'use strict';

    angular
        .module('app')
        .controller('AvengersCtrl', AvengersCtrl);

    AvengersCtrl.$inject = ['dataservice'];

    function AvengersCtrl(dataservice) {
        /* jshint validthis: true */
        var vm = this;

        vm.getAvengers = getAvengers;
        vm.isActive = isActive;
        vm.avengers = [];
        vm.selectedAvenger = undefined;
        vm.title = 'Avengers';

        activate();

        function activate() {
            return getAvengers();
        }

        function getAvengers() {
            return dataservice.getAvengers()
                .then(function(data){
                    vm.avengers = data.data;
                    return vm.selectedAvengers;
                });
        }

        function isActive(avenger) {
            return !!(vm.selectedAvenger === avenger);
        }
    }
})();