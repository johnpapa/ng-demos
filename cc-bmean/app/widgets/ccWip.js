(function () {
    'use strict';

    angular.module('app.widgets')
        .directive('ccWip', ['$window', ccWip]);

    function ccWip($route) {
        //Usage:
        //<li data-cc-wip
        //  wip="vm.wip"
        //  routes="vm.routes"
        //  changed-event="{{vm.wipChangedEvent}}"
        //  class="nlightblue"></li>
        var wipRouteName = 'workinprogress';
        var directive = {
            controller: ['$scope', wipController],
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
            $scope.wipExists = function () {
                return !!$scope.wip.length;
            };
            $scope.wipRoute = undefined;
            $scope.getWipClass = function () {
                return $scope.wipExists() ? ['fa', 'fa-asterisk', 'fa-asterisk-alert'] : ['fa', 'fa-asterisk'];
            };

            activate();

            function activate() {
                var eventName = $scope.changedEvent;
                $scope.$on(eventName, function (event, data) {
                    $scope.wip = data.wip;
                });
                $scope.wipRoute = $scope.routes.filter(function (r) {
                    return r.config.title === wipRouteName;
                })[0];
            }
        }

        function getTemplate() {
            return '<a href="#{{wipRoute.url}}" >' +
                '<i class="fa fa-asterisk" data-ng-class="getWipClass()"></i>' +
                'Work in Progress ({{wip.length}})</a>';
        }
    }
})();