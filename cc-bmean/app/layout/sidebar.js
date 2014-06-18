(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('Sidebar',
            ['$location', '$route', 'bootstrap.dialog', 'config',
                'datacontext', 'routehelper', Sidebar]);

    function Sidebar($location, $route, bsDialog, config, datacontext, routehelper) {
        /*jshint validthis: true */
        var vm = this;

        var keyCodes = config.keyCodes;

        vm.clearStorage = clearStorage;
        vm.isCurrent = isCurrent;
        vm.routes = routehelper.getRoutes();
        vm.search = search;
        vm.searchText = '';
        vm.wip = [];
        vm.wipChangedEvent = config.events.storage.wipChanged;

        activate();

        function activate() {
            getNavRoutes();
            vm.wip = datacontext.zStorageWip.getWipSummary();
        }

        function clearStorage() {
            return bsDialog.deleteDialog('local storage and work in progress')
                .then(confirmDelete).catch(cancelDelete);

            function confirmDelete() {
                datacontext.zStorage.clear();
            }

            function cancelDelete() {
            }
        }

        function getNavRoutes() {
            vm.navRoutes = vm.routes.filter(function (r) {
                return r.settings && r.settings.nav;
            }).sort(function (r1, r2) {
                    return r1.settings.nav - r2.settings.nav;
                });
        }

        function isCurrent(route) {
            if (!route.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.searchText = '';
                return;
            }
            if ($event.type === 'click' || $event.keyCode === keyCodes.enter) {
                var route = '/sessions/search/';
                $location.path(route + vm.searchText);
            }
        }
    }
})();