(function () {
    'use strict';

    var core = angular.module('app.core');

    var serviceId = 'controllerActivator';

    core.factory(serviceId, ['$q', '$rootScope', 'config', 'dataservice', controllerActivator]);

    function controllerActivator($q, $rootScope, config, dataservice) {
        var service = {
            activate: activate
        };

        return service;

        function activate(promises, controllerId) {
            return dataservice.ready(controllerId)
                .then(function(){
                    return $q.all(promises).then(function (eventArgs) {
                        var data = { controllerId: controllerId };
                        $rootScope.$broadcast(config.events.controllerActivateSuccess, data);
                    });
                });
        }
    }
})();