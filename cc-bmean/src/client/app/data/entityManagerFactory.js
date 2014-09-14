(function() {
    'use strict';

    angular
        .module('app.data')
        .factory('entityManagerFactory', emFactory);

    emFactory.$inject = ['breeze.config', 'model'];

    function emFactory(breezeConfig, model) {
        var breeze = breezeConfig.breeze;

        var serviceName = breezeConfig.remoteServiceName;
        var metadataStore = createMetadataStore();

        var provider = {
            metadataStore: metadataStore,
            newManager: newManager
        };

        return provider;

        function createMetadataStore() {
            var store = new breeze.MetadataStore();
            model.configureMetadataStore(store);
            if (model.useManualMetadata) {
                store.addDataService(new breeze.DataService({serviceName: serviceName}));
            }
            return store;
        }

        function newManager() {
            var mgr = new breeze.EntityManager({
                serviceName: serviceName,
                metadataStore: metadataStore
            });
            return mgr;
        }
    }
})();