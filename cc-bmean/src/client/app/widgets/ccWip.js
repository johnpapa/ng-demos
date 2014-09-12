(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('ccWip', ccWip);

    ccWip.$inject = ['$route'];

    function ccWip($route) {
        //Usage:
        //<li data-cc-wip
        //  wip="vm.wip"
        //  routes="vm.routes"
        //  changed-event="{{vm.wipChangedEvent}}"
        //  class="nlightblue"></li>
        var wipRouteName = 'workinprogress';
        var directive = {
            controller: wipController,
            controllerAs: 'vm',
            link: link,
            template: getTemplate(),
            scope: {
                'wip': '=',
                'changedEvent': '@',
                'routes': '='
            },
            restrict: 'A'
        };

        return directive;

        function link(scope, element, attrs) {
            scope.$watch(wipIsCurrent, function (value) {
                if (value) {
                    element.addClass('current');
                } else {
                    element.removeClass('current');
                }
            });

            function wipIsCurrent() {
                if (!$route.current || !$route.current.title) {
                    return false;
                }
                return $route.current.title.substr(0, wipRouteName.length) === wipRouteName;
            }
        }

        function wipController($scope) {
            /* jshint validthis: true */
            var vm = this;
            vm.wipExists = function () {
                return !!$scope.wip.length;
            };
            vm.wipRoute = undefined;
            vm.getWipClass = function () {
                return vm.wipExists() ? ['fa', 'fa-asterisk', 'fa-asterisk-alert'] : ['fa', 'fa-asterisk'];
            };

            activate();

            function activate() {
                var eventName = $scope.changedEvent;
                $scope.$on(eventName, function (event, data) {
                    vm.wip = data.wip;
                });
                vm.wipRoute = $scope.routes.filter(function (r) {
                    return r.title === wipRouteName;
                })[0];
            }
        }

        function getTemplate() {
            return '<a href="#{{vm.wipRoute.originalPath}}" >' +
                '<i class="fa fa-asterisk" data-ng-class="getWipClass()"></i>' +
                'Work in Progress ({{vm.wip.length}})</a>';
        }
    }
})();