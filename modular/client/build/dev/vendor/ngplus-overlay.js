/*
 * ngplus-overlay.js
 * Version 0.9.0
 * Copyright 2014 John Papa and Dan Wahlin
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * Author: John Papa and Dan Wahlin
 * Project: https://github.com/AngularPlus
 */
(function () {
    'use strict';

    var overlayApp = angular.module('ngplus', []);

    //Empty factory to hook into $httpProvider.interceptors
    //Directive will hookup request, response, and responseError interceptors
    overlayApp.factory('httpInterceptor', httpInterceptor);
    function httpInterceptor () { return {} }

    //Hook httpInterceptor factory into the $httpProvider interceptors so that we can monitor XHR calls
    overlayApp.config(['$httpProvider', httpProvider]);
    function httpProvider ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }

    //Directive that uses the httpInterceptor factory above to monitor XHR calls
    //When a call is made it displays an overlay and a content area
    //No attempt has been made at this point to test on older browsers
    overlayApp.directive('ngplusOverlay', ['$q', '$timeout', '$window', 'httpInterceptor', overlay]);

    function overlay ($q, $timeout, $window, httpInterceptor) {
        var directive = {
            scope: {
                ngplusOverlayDelayIn: "@",
                ngplusOverlayDelayOut: "@",
                ngplusOverlayAnimation: "@"
            },
            restrict: 'EA',
            transclude: true,
            template: getTemplate(),
            link: link
        };
        return directive;

        function getTemplate () {
            return '<div id="ngplus-overlay-container" ' +
                'class="{{ngplusOverlayAnimation}}" data-ng-show="!!show">' +
                '<div class="ngplus-overlay-background"></div>' +
                '<div id="ngplus-overlay-content" class="ngplus-overlay-content" data-ng-transclude>' +
                '</div>' +
                '</div>';
        }

        function link (scope, element, attrs) {
            var defaults = {
                overlayDelayIn: 500,
                overlayDelayOut: 500
            };
            var delayIn = scope.ngplusOverlayDelayIn ? scope.ngplusOverlayDelayIn : defaults.overlayDelayIn;
            var delayOut = scope.ngplusOverlayDelayOut ? scope.ngplusOverlayDelayOut : defaults.overlayDelayOut;
            var overlayContainer = null;
            var queue = [];
            var timerPromise = null;
            var timerPromiseHide = null;

            init();

            function init() {
                wireUpHttpInterceptor();
                if (window.jQuery) wirejQueryInterceptor();
                overlayContainer = document.getElementById('ngplus-overlay-container');
            }

            //Hook into httpInterceptor factory request/response/responseError functions
            function wireUpHttpInterceptor() {

                httpInterceptor.request = function (config) {
                    processRequest();
                    return config || $q.when(config);
                };

                httpInterceptor.response = function (response) {
                    processResponse();
                    return response || $q.when(response);
                };

                httpInterceptor.responseError = function (rejection) {
                    processResponse();
                    return $q.reject(rejection);
                };
            }

            //Monitor jQuery Ajax calls in case it's used in an app
            function wirejQueryInterceptor() {
                $(document).ajaxStart(function () { processRequest(); });
                $(document).ajaxComplete(function () { processResponse(); });
                $(document).ajaxError(function () { processResponse(); });
            }

            function processRequest() {
                queue.push({});
                if (queue.length == 1) {
                    timerPromise = $timeout(function () {
                        if (queue.length) showOverlay();
                    }, delayIn); //Delay showing for 500 millis to avoid flicker
                }
            }

            function processResponse() {
                queue.pop();
                if (queue.length == 0) {
                    //Since we don't know if another XHR request will be made, pause before
                    //hiding the overlay. If another XHR request comes in then the overlay
                    //will stay visible which prevents a flicker
                    timerPromiseHide = $timeout(function () {
                        //Make sure queue is still 0 since a new XHR request may have come in
                        //while timer was running
                        if (queue.length == 0) {
                            hideOverlay();
                            if (timerPromiseHide) $timeout.cancel(timerPromiseHide);
                        }
                    }, delayOut);
                }
            }

            function showOverlay() {
                var w = 0;
                var h = 0;
                if (!$window.innerWidth) {
                    if (!(document.documentElement.clientWidth == 0)) {
                        w = document.documentElement.clientWidth;
                        h = document.documentElement.clientHeight;
                    }
                    else {
                        w = document.body.clientWidth;
                        h = document.body.clientHeight;
                    }
                }
                else {
                    w = $window.innerWidth;
                    h = $window.innerHeight;
                }
                var content = document.getElementById('ngplus-overlay-content');
                var contentWidth = parseInt(getComputedStyle(content, 'width').replace('px', ''));
                var contentHeight = parseInt(getComputedStyle(content, 'height').replace('px', ''));

                content.style.top = h / 2 - contentHeight / 2 + 'px';
                content.style.left = w / 2 - contentWidth / 2 + 'px';

                scope.show = true;
            }

            function hideOverlay() {
                if (timerPromise) $timeout.cancel(timerPromise);
                scope.show = false;
            }

            var getComputedStyle = function () {
                var func = null;
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    func = document.defaultView.getComputedStyle;
                } else if (typeof (document.body.currentStyle) !== "undefined") {
                    func = function (element, anything) {
                        return element["currentStyle"];
                    };
                }

                return function (element, style) {
                    return func(element, null)[style];
                }
            }();
        }
    }
}());