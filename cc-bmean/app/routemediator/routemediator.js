(function () {
    'use strict';

    var app = angular.module('app.routemediator');

    var serviceId = 'routeMediator';
    app.factory(serviceId,
        ['$location', '$rootScope', 'config', 'logger', routeMediator]);

    function routeMediator($location, $rootScope, config, logger) {
        var handlingRouteChangeError = false;
        var routeCounts = {
            errors: 0,
            changes: 0
        };
        var service = {
            init: init,
            routeCounts: routeCounts
        };

        return service;

        function init() {
            handleRoutingErrors();
            updateDocTitle();
        }

        function handleRoutingErrors() {
            // Route cancellation:
            // On routing error, go to the dashboard.
            // Provide an exit clause if it tries to do it twice.
            $rootScope.$on('$routeChangeError',
                function (event, current, previous, rejection) {
                    if (handlingRouteChangeError) {
                        return;
                    }
                    routeCounts.errors++;
                    handlingRouteChangeError = true;
                    var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) ||
                        'unknown target';
                    var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');
                    logger.warning(msg, [current, serviceId]);
                    $location.path('/');
                }
            );
        }

        function updateDocTitle() {
            $rootScope.$on('$routeChangeSuccess',
                function (event, current, previous) {
                    routeCounts.changes++;
                    handlingRouteChangeError = false;
                    var title = config.docTitle + ' ' + (current.title || '');
                    $rootScope.title = title; // data bind to <title>
                }
            );
        }
    }
})();