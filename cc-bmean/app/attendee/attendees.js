(function () {
    'use strict';

    var controllerId = 'attendees';
    angular.module('app').controller(controllerId,
        ['common', 'config', 'datacontext', attendees]);

    function attendees(common, config, datacontext) {
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
            common.activateController([getAttendees()], controllerId);
        }

        function getAttendeeCount() {
            return datacontext.attendee.getCount().then(function (data) {
                vm.attendeeCount = data;
                return vm.attendeeCount;
            });
        }

        function getAttendeeFilteredCount() {
            vm.attendeeFilteredCount = datacontext.attendee.getFilteredCount(vm.attendeeSearch);
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