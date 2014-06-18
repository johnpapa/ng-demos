(function () {
    'use strict';

    angular
        .module('app')
        .controller('speakers', ['$location', 'common', 'config', 'datacontext', speakers]);

    function speakers($location, common, config, datacontext) {
        /*jshint validthis: true */
        var vm = this;

        var keyCodes = config.keyCodes;

        // Define viewmodel variables
        vm.filteredSpeakers = [];
        vm.gotoSpeaker = gotoSpeaker;
        vm.refresh = refresh;
        vm.search = search;
        vm.speakerSearch = '';
        vm.speakers = [];
        vm.title = 'Speakers';

        // Kickoff functions
        activate();

        function activate() {
            datacontext.ready([getSpeakers()]);
        }

        function applyFilter() {
            vm.filteredSpeakers = vm.speakers.filter(speakerFilter);
        }

        function getSpeakers(forceRefresh) {
            return datacontext.speaker.getPartials(forceRefresh).then(function (data) {
                // We don't handle the 'fail' because the datacontext will handle the fail.
                vm.speakers = data;
                applyFilter();
                return data;
            });
        }

        function gotoSpeaker(speaker) {
            if (speaker && speaker.id) {
                $location.path('/speaker/' + speaker.id);
            }
        }

        function refresh() {
            getSpeakers(true);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.speakerSearch = '';
            }
            applyFilter();
        }

        function speakerFilter(speaker) {
            var isMatch = vm.speakerSearch ? common.textContains(speaker.fullName, vm.speakerSearch) : true;
            //if (isMatch) { vm.filteredCount++; }
            return isMatch;
        }
    }
})();