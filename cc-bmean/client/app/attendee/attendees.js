(function () {
    'use strict';

    angular
        .module('app.attendees')
        .controller('Attendees', Attendees);

    Attendees.$inject = ['config', 'datacontext'];

    function Attendees(config, datacontext) {
        /*jshint validthis: true */
        var vm = this;

        var keyCodes = config.keyCodes;

        vm.attendeeCount = 0;
        vm.attendeeFilteredCount = 0;
        vm.attendeeSearch = '';
        vm.attendees = [];
        vm.filteredAttendees = [];
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 15
        };
        vm.pageChanged = pageChanged;
        vm.refresh = refresh;
        vm.search = search;
        vm.title = 'Attendees';

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.attendeeFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
//            TODO: Using a resolver on all routes or datacontext.ready in every controller
//            return datacontext.ready([getAttendees()]);
            return getAttendees();
        }

        function getAttendeeCount() {
            return datacontext.attendee.getCount().then(function (data) {
                vm.attendeeCount = data;
                return vm.attendeeCount;
            });
        }

        function getAttendees(forceRefresh) {
            return datacontext.attendee.getAll(
                    forceRefresh,
                    vm.paging.currentPage,
                    vm.paging.pageSize,
                    vm.attendeeSearch)
                .then(function (data) {
                    vm.attendees = data;
                    if (!vm.attendeeCount || forceRefresh) {
                        // Only grab the full count once or on refresh
                        getAttendeeCount();
                    }
                    getAttendeeFilteredCount();
                    return data;
                });
        }

        function getAttendeeFilteredCount() {
            vm.attendeeFilteredCount = datacontext.attendee.getFilteredCount(vm.attendeeSearch);
        }

        function pageChanged(page) {
            if (!page) {
                return;
            }
            vm.paging.currentPage = page;
            getAttendees();
        }

        function refresh() {
            return getAttendees(true);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.attendeeSearch = '';
            }
            getAttendees();
        }
    }
})();