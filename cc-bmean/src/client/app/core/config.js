(function() {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    /* @ngInject */
    toastrConfig.$inject = ['toastr'];
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    var keyCodes = {
        backspace: 8,
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        insert: 45,
        del: 46
    };

    var imageSettings = {
        imageBasePath: '../content/images/photos/',
        unknownPersonImageSource: 'unknown_person.jpg'
    };

    var events = {
        controllerActivateSuccess: 'controller.activateSuccess',
        entitiesChanged: 'datacontext.entitiesChanged',
        entitiesImported: 'datacontext.entitiesImported',
        hasChangesChanged: 'datacontext.hasChangesChanged',
        storage: {
            error: 'store.error',
            storeChanged: 'store.changed',
            wipChanged: 'wip.changed'
        }
    };

    var config = {
        appErrorPrefix: '[CC Error] ', //Configure the exceptionHandler decorator
        events: events,
        imageSettings: imageSettings,
        keyCodes: keyCodes,
        version: '1.1.0'
    };

    core.constant('config', config);

    core.config(configure);

    configure.$inject = [
        '$logProvider', '$routeProvider',
        'exceptionConfigProvider', 'routehelperConfigProvider', 'toastr'
    ];

    /* @ngInject */
    function configure(
        $logProvider, $routeProvider,
        exceptionConfigProvider, routehelperConfigProvider, toastr) {

        configureToastr();
        configureLogging();
        configureExceptions();
        configureRouting();

        function configureToastr() {
            toastr.options.timeOut = 4000;
            toastr.options.positionClass = 'toast-bottom-right';
        }

        function configureLogging() {
            // turn debugging off/on (no info or warn)
            if ($logProvider.debugEnabled) {
                $logProvider.debugEnabled(true);
            }
        }

        function configureExceptions() {
            exceptionConfigProvider.config.appErrorPrefix = config.appErrorPrefix;
        }

        function configureRouting() {
            var routeCfg = routehelperConfigProvider;
            routeCfg.config.$routeProvider = $routeProvider;
            routeCfg.config.docTitle = 'CC: ';
            routeCfg.config.resolveAlways = { /* @ngInject */
                ready: function(datacontext) {
                    return datacontext.ready();
                }
//                ready: ['datacontext', function (datacontext) {
//                    return datacontext.ready();
//                }]
            };
        }
    }
})();