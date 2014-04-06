(function () {
    'use strict';

    var controllerId = 'topnavController';

    angular.module('app')
        .controller(controllerId, ['$route', topnavController]);

    function topnavController($route) {
        var vm = this;

        vm.isRoute = isRoute;

        function isRoute(r) {
            return $route.current.title.substr(0, r.length) === r;
        }
    }
})();