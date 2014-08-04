(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];
    
    /* @ngInject */ 
    function toastrConfig(toastr){
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    var config = {
        appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Angular Modular Demo',
        version: '1.0.0'
    };

    core.value('config', config);

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
            cfg.config.docTitle = 'NG-Modular: ';
            var resolveAlways = /* @ngInject */ {
                ready: function (dataservice) {
                    return dataservice.ready();
                }
                // ready: ['dataservice', function (dataservice) {
                //    return dataservice.ready();
                // }]
            };
            cfg.config.resolveAlways = resolveAlways;
        }]);

    // Configure the common exception handler
    core.config(['exceptionConfigProvider', function (cfg) {
        cfg.config.appErrorPrefix = config.appErrorPrefix;
    }]);
})();