(function () {
    'use strict';

    angular
        .module('app')
        .controller('Sessions', Sessions);

    Sessions.$inject = ['$location', '$routeParams', 'common', 'config', 'datacontext'];

    function Sessions($location, $routeParams, common, config, datacontext) {
        /*jshint validthis: true */
        var vm = this;

        var keyCodes = config.keyCodes;
        var applyFilter = function () {};

        vm.filteredSessions = [];
        vm.gotoSession = gotoSession;
        vm.refresh = refresh;
        vm.search = search;
        vm.sessions = [];
        vm.sessionsFilter = sessionsFilter;
        vm.sessionsSearch = $routeParams.search || '';
        vm.title = 'Sessions';

        activate();

        function activate() {
            datacontext.ready([getSessions()]).then(function () {
                applyFilter = common.createSearchThrottle(vm, 'sessions');
                if (vm.sessionsSearch) {
                    applyFilter(true /*now*/);
                }
            });
        }

        function getSessions(forceRefresh) {
            return datacontext.session.getPartials(forceRefresh).then(function (data) {
                vm.sessions = vm.filteredSessions = data;
                return vm.sessions;
            });
        }

        function gotoSession(session) {
            if (session && session.id) {
                $location.path('/session/' + session.id);
            }
        }

        function refresh() {
            getSessions(true);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.sessionsSearch = '';
                applyFilter(true /*now*/);
            } else {
                applyFilter();
            }
        }

        function sessionsFilter(session) {
            var textContains = common.textContains;
            var searchText = vm.sessionsSearch;
            var isMatch = searchText ? textContains(session.title, searchText) ||
                textContains(session.tagsFormatted, searchText) ||
                textContains(session.room.name, searchText) ||
                textContains(session.track.name, searchText) ||
                textContains(session.speaker.fullName, searchText) : true;
            return isMatch;
        }
    }
})();