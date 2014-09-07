(function () {
    'use strict';

    angular.module('app')
        .controller('TopNavCtrl', TopNavCtrl);

    TopNavCtrl.$inject = ['$route'];

    function TopNavCtrl($route) {
        /* jshint validthis:true */
        var vm = this;

        vm.isRoute = isRoute;

        function isRoute(r) {
            return $route.current.title.substr(0, r.length) === r;
        }
    }
})();