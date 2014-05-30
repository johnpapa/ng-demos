(function () {
    'use strict';

    // Configure Toastr
    var tos = toastr.options;
    tos.timeOut = 4000;
    tos.positionClass = 'toast-bottom-right';
//    tos.showMethod = 'slideDown';
//    tos.hideMethod = 'slideUp';

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
        docTitle: 'CC: ',
        events: events,
        imageSettings: imageSettings,
        keyCodes: keyCodes,
        version: '1.1.0'
    };

    var app = angular.module('app');
    app.constant('config', config); // a constant is available at config time

    /*********************************************************************
     * Other provider configuration based on these config constant values
     *********************************************************************/

    app.config(['$logProvider', function ($logProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
    }]);

    app.config(['commonConfigProvider', function (cfg) {
        cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
    }]);

})();