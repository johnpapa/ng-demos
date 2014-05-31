(function () {
    'use strict';

    var core = angular.module('app.core');

    var serviceId = 'controllerActivator';

    core.factory(serviceId, ['$q', '$rootScope', 'config', 'datacontext', controllerActivator]);

    function controllerActivator($q, $rootScope, config, datacontext) {
        var service = {
            activate: activate
        };

        return service;

        function activate(promises, controllerId) {
            return datacontext.ready(controllerId)
                .then(function(){
                    return $q.all(promises).then(function (eventArgs) {
                        var data = { controllerId: controllerId };
                        $rootScope.$broadcast(config.events.controllerActivateSuccess, data);
                    });
                });
        }
    }
})();