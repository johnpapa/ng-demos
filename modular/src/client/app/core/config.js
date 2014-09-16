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
        routerHelperProvider, exceptionConfigProvider) {

        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        exceptionConfigProvider.config.appErrorPrefix = config.appErrorPrefix;
        configureStateHelper();

        ////////////////

        function configureStateHelper() {
            var resolveAlways = { /* @ngInject */
                ready: function(dataservice) {
                    return dataservice.ready();
                }
                // ready: ['dataservice', function (dataservice) {
                //    return dataservice.ready();
                // }]
            };

            routerHelperProvider.configure({
                $stateProvider: $stateProvider, 
                $urlRouterProvider: $urlRouterProvider,
                docTitle: 'NG-Modular: ',
                resolveAlways: resolveAlways
            });
        }
    }
})();
