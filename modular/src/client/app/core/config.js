(function() {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    var config = {
        appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Angular Modular Demo',
        version: '1.0.0'
    };

    core.value('config', config);

    core.config(configure);

    /* @ngInject */
    function configure (
        $logProvider, $stateProvider, $urlRouterProvider, 
        routehelperConfigProvider, exceptionConfigProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }

        // Configure the common route provider
        routehelperConfigProvider.$stateProvider = $stateProvider;
        routehelperConfigProvider.$urlRouterProvider = $urlRouterProvider;
        routehelperConfigProvider.docTitle = 'NG-Modular: ';
        var resolveAlways = { /* @ngInject */
            ready: function(dataservice) {
                return dataservice.ready();
            }
            // ready: ['dataservice', function (dataservice) {
            //    return dataservice.ready();
            // }]
        };
        routehelperConfigProvider.resolveAlways = resolveAlways;

        // routehelperConfigProvider.configureRouteHelper(
        //     $stateProvider, 
        //     $urlRouterProvider,
        //     'NG-Modular: ',
        //     resolveAlways
        // );

        // Configure the common exception handler
        exceptionConfigProvider.config.appErrorPrefix = config.appErrorPrefix;
    }
})();
