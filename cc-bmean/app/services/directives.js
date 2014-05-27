(function () {
    'use strict';

    var app = angular.module('app');

    app.directive('ccSidebar', function () {
        // Opens and closes the sidebar menu.
        // Usage:
        //  <div data-cc-sidebar>
        // Creates:
        //  <div data-cc-sidebar class="sidebar">
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var $sidebarInner = element.find('.sidebar-inner');
            var $dropdownElement = element.find('.sidebar-dropdown a');
            element.addClass('sidebar');
            $dropdownElement.click(dropdown);

            function dropdown(e) {
                var dropClass = 'dropy';
                e.preventDefault();
                if (!$dropdownElement.hasClass(dropClass)) {
                    hideAllSidebars();
                    $sidebarInner.slideDown(350);
                    $dropdownElement.addClass(dropClass);
                } else if ($dropdownElement.hasClass(dropClass)) {
                    $dropdownElement.removeClass(dropClass);
                    $sidebarInner.slideUp(350);
                }

                function hideAllSidebars() {
                    $sidebarInner.slideUp(350);
                    $('.sidebar-dropdown a').removeClass(dropClass);
                }
            }
        }
    });

    app.directive('ccWidgetClose', function () {
        // Usage:
        // <a data-cc-widget-close></a>
        // Creates:
        // <a data-cc-widget-close="" href="#" class="wclose">
        //     <i class="fa fa-remove"></i>
        // </a>
        var directive = {
            link: link,
            template: '<i class="fa fa-remove"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('href', '#');
            attrs.$set('wclose');
            element.click(closeWidget);

            function closeWidget(e) {
                e.preventDefault();
                element.parent().parent().parent().hide(100);
            }
        }
    });

    app.directive('ccWidgetMinimize', function () {
        // Usage:
        // <a data-cc-widget-minimize></a>
        // Creates:
        // <a data-cc-widget-minimize="" href="#"><i class="fa fa-chevron-up"></i></a>
        var directive = {
            link: link,
            template: '<i class="fa fa-chevron-up"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            //$('body').on('click', '.widget .wminimize', minimize);
            attrs.$set('href', '#');
            attrs.$set('wminimize');
            element.click(minimize);

            function minimize(e) {
                e.preventDefault();
                var $wcontent = element.parent().parent().next('.widget-content');
                var iElement = element.children('i');
                if ($wcontent.is(':visible')) {
                    iElement.removeClass('fa fa-chevron-up');
                    iElement.addClass('fa fa-chevron-down');
                } else {
                    iElement.removeClass('fa fa-chevron-down');
                    iElement.addClass('fa fa-chevron-up');
                }
                $wcontent.toggle(500);
            }
        }
    });

    app.directive('ccScrollToTop', ['$window',
        // Usage:
        // <span data-cc-scroll-to-top></span>
        // Creates:
        // <span data-cc-scroll-to-top="" class="totop">
        //      <a href="#"><i class="fa fa-chevron-up"></i></a>
        // </span>
        function ($window) {
            var directive = {
                link: link,
                template: '<a href="#"><i class="fa fa-chevron-up"></i></a>',
                restrict: 'A'
            };
            return directive;

            function link(scope, element, attrs) {
                var $win = $($window);
                element.addClass('totop');
                $win.scroll(toggleIcon);

                element.find('a').click(function (e) {
                    e.preventDefault();
                    // Learning Point: $anchorScroll works, but no animation
                    //$anchorScroll();
                    $('body').animate({ scrollTop: 0 }, 500);
                });

                function toggleIcon() {
                    if ($win.scrollTop() > 300) {
                        element.slideDown();
                    } else {
                        element.slideUp();
                    }
                }
            }
        }
    ]);

    app.directive('ccSpinner', ['$window', function ($window) {
        // Description:
        //  Creates a new Spinner and sets its options
        // Usage:
        //  <div data-cc-spinner="vm.spinnerOptions"></div>
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.spinner = null;
            scope.$watch(attrs.ccSpinner, function (options) {
                if (scope.spinner) {
                    scope.spinner.stop();
                }
                scope.spinner = new $window.Spinner(options);
                scope.spinner.spin(element[0]);
            }, true);
        }
    }]);

    app.directive('ccImgPerson', ['config', function (config) {
        // Descripton:
        //  Creates an image element and concatenates the image path and file name
        // Usage:
        //  <img data-cc-img-person="{{s.imageSource}}" class="img-thumbnail"></div>
        var basePath = config.imageSettings.imageBasePath;
        var unknownImage = config.imageSettings.unknownPersonImageSource;
        var directive = {
            link: link,
            //priority: 99, // it needs to run after the attributes are interpolated
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$observe('ccImgPerson', function (value) {
                value = basePath + (value || unknownImage);
                attrs.$set('src', value);
            });
        }
    }]);

    app.directive('ccWidgetHeader', function () {
        //Usage:
        //<div data-cc-widget-header title="vm.map.title"></div>
        var directive = {
            link: link,
            scope: {
                'title': '@',
                'subtitle': '@',
                'rightText': '@',
                'allowCollapse': '@'
            },
            templateUrl: '/app/layout/widgetheader.html',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('class', 'widget-head');
        }
    });

    app.directive('ccWip', ['$route', function ($route) {
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
    }]);
})();