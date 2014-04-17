/*
 * entityManagerFactory creates the model and delivers a new EntityManager
 */
(function (){
    'use strict';
    angular.module('app').factory('entityManagerFactory',
        ['$q', 'breeze', 'config', 'model', 'wip-service', service]);

    function service($q, breeze, config, model, wip){
        var manager;
        configureBreeze();

        var emFactory =  {
            getEntityManager: getEntityManager
        };
        return emFactory;
        //////////////////////
        function configureBreeze(){
            // use Breeze Labs mobile services dataservice adapter to query and save
            var adapter = breeze.config.initializeAdapterInstance('dataService', 'azure-mobile-services', true);
            adapter.mobileServicesInfo = {url: config.appUrl, appKey: config.appKey};
            adapter.Q = $q;
        }

        function getEntityManager(){
            if (!manager) {
                var serviceName = config.appUrl + "tables/";
                manager =  new breeze.EntityManager(serviceName);
                model.setModel(manager);
                wip.initialize(manager, 'TodoItem');
            }
            return manager;
        }
    }
})();
