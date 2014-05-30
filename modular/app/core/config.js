(function () {
    'use strict';

    var core = angular.module('app.core');

    // Configure Toastr
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';

    var events = {
        controllerActivateSuccess: 'controller.activateSuccess',
        spinnerToggle: 'spinner.toggle'
    };

    var config = {
        appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator
        docTitle: 'NG-Modular: ',
        events: events,
        appTitle: 'Angular Modular Demo',
        version: '1.0.0'
    };

    core.value('config', config);

    core.constant('toastr', toastr);

    core.config(['$logProvider', function ($logProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
    }]);

    // Configure the common route provider
    core.config(['$routeProvider', 'routehelperConfigProvider',
        function ($routeProvider, cfg) {
            cfg.config.$routeProvider = $routeProvider;
        }]);

    // Configure the common exception handler
    core.config(['exceptionConfigProvider', function (cfg) {
        cfg.config.appErrorPrefix = config.appErrorPrefix;
    }]);

    // Configure the common services via commonConfig
    core.config(['commonConfigProvider', function (cfg) {
        cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
        cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
    }]);
})();