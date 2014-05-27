(function () {
    'use strict';

    var controllerId = 'sessions';
    angular.module('app').controller(controllerId,
        ['$location', '$scope', '$route', '$routeParams',
            'common', 'config', 'datacontext', sessions]);

    function sessions($location, $scope, $route, $routeParams, common, config, datacontext) {
        var vm = this;
        var keyCodes = config.keyCodes;
        var applyFilter = function () {
        };

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
            // Learning point
            // Could use $q here, but we wrapped it instead.
            //$q.all([getSessions()])
            //    .then(function (data) { common.activateSuccess(controllerId); });
            common.activateController([getSessions()], controllerId).then(function () {
                // createSearchThrottle uses values by convention, via its parameters:
                //     vm.sessionsSearch is where the user enters the search
                //     vm.sessions is the original unfiltered array
                //     vm.filteredSessions is the filtered array
                //     vm.sessionsFilter is the filtering function
                applyFilter = common.createSearchThrottle(vm, 'sessions');
                if (vm.sessionsSearch) {
                    applyFilter(true /*now*/);
                }
            });
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.sessionsSearch = '';
                applyFilter(true /*now*/);
            } else {
                applyFilter();
            }
        }

        function getSessions(forceRefresh) {
            return datacontext.session.getPartials(forceRefresh).then(function (data) {
                vm.sessions = vm.filteredSessions = data;
                return vm.sessions;
            });
        }

        function gotoSession(session) {
            if (session && session.id) {
                // '#/session/71'
                //$route.transition(url)
                $location.path('/session/' + session.id);
            }
        }

        function refresh() {
            getSessions(true);
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