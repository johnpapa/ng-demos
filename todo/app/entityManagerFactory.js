/*
 * entityManagerFactory creates the model and delivers a new EntityManager
 */
(function (){
    'use strict';
    angular.module('app').factory('entityManagerFactory',
        ['$q', '$log', 'breeze', 'config', 'model', 'wip-service', service]);

    function service($q, $log, breeze, config, model, wip){
        var manager;

        var emFactory =  {
            getEntityManager: getEntityManager
        };
        return emFactory;
        //////////////////////


        function getEntityManager(){
            if (manager) {
                return $q.when(manager);

            } else {
                // No manager yet; create it and load its metadata
                var dataService = new breeze.DataService({
                    hasServerMetadata: config.hasServerMetadata,
                    serviceName: config.serviceName
                });

                manager =  new breeze.EntityManager({dataService: dataService});
                wip.initialize(manager);
                return model.setModel(manager); 
            }
        }
    }
})();
