/*
 * Server delivers a new Breeze EntityManager on request.
 *
 * During service initialization:
 * - configures Breeze for use by this app
 * - gets entity metadata and sets up the client entity model
 * - configures the app to call the server during service initialization
 */
(function(angular) {
    'use strict';

    angular.module("app").factory( 'entityManagerFactory',
        ['breeze', 'config', 'model', factory] );

    function factory( breeze, config, model ) {
        configureBreezeForThisApp();
        var masterManager = null;
        var serviceName = config.serviceName;
        var metadataStore = getMetadataStore();

        var service =  {
            getManager: getManager, // get the "master manager", creating if necessary
            newManager: newManager  // creates a new manager, not the "master manager"
        };
        return service;
        /////////////////////
        function getMetadataStore() {
            var store = new breeze.MetadataStore();

            // Associate these metadata data with this Node service
            store.addDataService(new breeze.DataService({ serviceName: serviceName }));

            // Extend model types with metadata, properties, and behavior
            model.addToMetadataStore(store);

            return store;
        }
        // get the "master manager", creating if necessary
        function getManager(){
            return masterManager || (masterManager = service.newManager());
        }
        // create a new manager, not the "master manager"
        function newManager() {
            return new breeze.EntityManager({
                serviceName: serviceName,
                metadataStore: metadataStore
            });
        }

        function configureBreezeForThisApp() {
            breeze.config.initializeAdapterInstance("dataService", "mongo", true);
            initBreezeAjaxAdapter(config.userSessionId);
        }

        function initBreezeAjaxAdapter(userSessionId) {
            // get the current default Breeze AJAX adapter
            var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
            ajaxAdapter.defaultSettings = {
                headers: {
                    "X-UserSessionId": userSessionId
                },
                timeout: config.httpTimeout || 10000
            };
        }
    }

}( this.angular ));
