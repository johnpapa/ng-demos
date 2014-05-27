/*
 * Copyright 2013 John Papa. All Rights Reserved.  
 * Use, reproduction, distribution, and modification of this code is subject to the terms and 
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * Author: John Papa 
 * Project: https://github.com/johnpapa/angular.breeze.storagewip
 *
 * Version: 1.0.3
 *
 * Dependencies: HTML5 localStorage, Breeze and Angular.
 *
 * Description:
 * Defines the ngzWip module, and provides the base 
 * features for the services zStorage and zStorageWip 
 * 
 * Must setup the zStorageConfigProvider first, with all of 
 * the storage settings.
 */
(function () {
    'use strict';

    var storageModule = angular.module('ngzWip', []);

    /*
     * storageModule provider
     * 
     * Configure the Storage and WIP features.
     */
    storageModule.provider('zStorageConfig', function () {
        this.config = {
            // These are the properties we need to set storage
            enabled: false,
            key: '',
            events: {
                error: 'store.error',
                storeChanged: 'store.changed',
                wipChanged: 'wip.changed'
            },
            wipKey: '',
            appErrorPrefix: '[ngzWip] ',
            newGuid: breeze.core.getUuid,
            version: ''
        };

        this.$get = function () {
            return {
                config: this.config
            };
        };
    });

    /*
     * zStorageCore service
     * 
     * For internal use by storage and zStorageWip services
     */
    storageModule.factory('zStorageCore', ['$rootScope', 'zStorageConfig', zStorageCore]);

    function zStorageCore($rootScope, zStorageConfig) {
        var storeConfig = zStorageConfig.config;
        var storeMeta = {
            breezeVersion: breeze.version,
            appVersion: storeConfig.version,
            isLoaded: {}
        };

        var service = {
            _broadcast: _broadcast,
            checkStoreImportVersionAndParseData: checkStoreImportVersionAndParseData,
            formatStorageData: formatStorageData,
            clearAllIsLoadedFlags: clearAllIsLoadedFlags,
            storeMeta: storeMeta
        };

        return service;

        function _broadcast(messageName, activity, wip) {
            return $rootScope.$broadcast(messageName, { activity: activity, wip: wip || [] });
        }

        function checkStoreImportVersionAndParseData(importedData) {
            if (!importedData) {
                return importedData;
            }
            try {
                var data = JSON.parse(importedData);
                var importMeta = data[0];
                if (importMeta.breezeVersion === storeMeta.breezeVersion &&
                    importMeta.appVersion === storeMeta.appVersion) {
                    return data[1];
                } else {
                    _broadcast(storeConfig.events.error,
                        'Did not load from storage because mismatched versions',
                        { current: storeMeta, storage: importMeta });
                }
            } catch (ex) {
                _broadcast(storeConfig.events.error, 'Exception during load from storage: ' + ex.message, ex);
            }
            return null; // failed
        }
        
        function clearAllIsLoadedFlags() {
            for (var prop in storeMeta.isLoaded) {
                if (storeMeta.isLoaded.hasOwnProperty(prop)) {
                    storeMeta.isLoaded[prop] = false;
                }
            }
        }

        function formatStorageData(meta, data) {
            return '[' + JSON.stringify(meta) + ',' + data + ']';
        }
    }

    /*
     * storage service
     * 
     * API's for saving, loading, and clearing breeze
     * entity manager from local storage
     */
    storageModule.factory('zStorage',
        ['$rootScope', '$window', 'zStorageConfig', 'zStorageCore', zStorage]);

    function zStorage($rootScope, $window, zStorageConfig, zStorageCore) {
        var storeConfig = zStorageConfig.config;
        var manager;
        var storageKey = storeConfig.key;
        var enabled = storeConfig.enabled;

        var service = {
            areItemsLoaded: areItemsLoaded,
            clear: clear,
            init: init,
            load: load,
            save: save
        };

        return service;

        function init(mgr) { manager = mgr; }

        function areItemsLoaded(key, value) {
            if (value === undefined) {
                return zStorageCore.storeMeta.isLoaded[key]; // get
            }
            return zStorageCore.storeMeta.isLoaded[key] = value; // set
        }

        function clear() {
            $window.localStorage.clear();
            zStorageCore.clearAllIsLoadedFlags();
            zStorageCore._broadcast(storeConfig.events.wipChanged, 'cleared all WIP');
            zStorageCore._broadcast(storeConfig.events.storeChanged, 'cleared');
        }

        function load() {
            if (enabled) {
                return importData();
            }
            return false;
        }

        function save() {
            if (enabled) {
                var exportData = manager.exportEntities();
                saveToLocalStorage(storageKey, exportData);
                zStorageCore._broadcast(storeConfig.events.storeChanged, 'saved', exportData);
            }
        }

        function importData() {
            var importedData = $window.localStorage.getItem(storageKey);
            importedData = zStorageCore.checkStoreImportVersionAndParseData(importedData);
            var hasData = !!importedData;
            if (hasData) {
                manager.importEntities(importedData);
            }
            return hasData;
        }

        function saveToLocalStorage(key, data) {
            var stash = zStorageCore.formatStorageData(zStorageCore.storeMeta, data);
            $window.localStorage.setItem(key, stash);
        }
    }

    /*
     * zStorageWip service
     * 
     * API's for saving, loading, finding and clearing breeze
     * breeze work in progress (WIP) from local storage
     */
    storageModule.factory('zStorageWip',
        ['$q', '$rootScope', '$window', 'zStorageConfig', 'zStorageCore', zStorageWip]);

    function zStorageWip($q, $rootScope, $window, zStorageConfig, zStorageCore) {
        var storeConfig = zStorageConfig.config;
        var manager;
        var wipKey = storeConfig.wipKey;

        var service = {
            clearAllWip: clearAllWip,
            findWipKeyByEntityId: findWipKeyByEntityId,
            init: init,
            getWipSummary: getWipSummary,
            loadWipEntity: loadWipEntity,
            removeWipEntity: removeWipEntity,
            storeWipEntity: storeWipEntity
        };

        return service;

        function init(mgr) {
            manager = mgr;
            return service;
        }

        function clearAllWip() {
            var wip = getWipSummary();
            wip.forEach(function (item) {
                $window.localStorage.removeItem(item.key);
            });
            zStorageCore._broadcast(storeConfig.events.wipChanged, 'cleared all WIP');
            $window.localStorage.removeItem(wipKey);
        }

        function findWipKeyByEntityId(entityName, id) {
            var wip = getWipSummary();
            var wipItem = wip.filter(function (item) {
                return item.entityName.toLowerCase() === entityName.toLowerCase() && item.id === id;
            })[0];
            return wipItem ? wipItem.key : null;
        }

        function getWipSummary() {
            var wip = [];
            var raw = $window.localStorage.getItem(wipKey);
            if (raw) { wip = JSON.parse(raw); }
            return wip;
        }

        function loadWipEntity(key) {
            return importWipData(key);
        }

        function removeWipEntity(key) {
            if (!key) { return; }

            $window.localStorage.removeItem(key);
            // Remove the 1 wip header and create new array
            var wip = getWipSummary();
            var updatedWip = wip.filter(function (item) {
                return item.key !== key;
            });
            // re-save the wip summary and broadcast the changes
            $window.localStorage.setItem(wipKey, JSON.stringify(updatedWip));
            zStorageCore._broadcast(storeConfig.events.wipChanged, 'removed 1 entity', updatedWip);
        }

        function storeWipEntity(entity, key, entityName, description, routeState) {
            // Entity is the entity to export.
            // key must also be passed. this allows us to save
            // an entity by itself away from the datacontext.
            // Data stashed here will not be imported into the 
            // datacontext automatically.
            var prefix = storeConfig.appErrorPrefix;
            if (!entity) { throw new Error(prefix + 'Must pass entity to storeWipEntity'); }
            if (!entityName) { throw new Error(prefix + 'Must pass entityName to storeWipEntity'); }
            if (!description) { throw new Error(prefix + 'Must pass description to storeWipEntity'); }
            if (!routeState) { routeState = entityName.toLowerCase(); }

            var entityState = entity.entityAspect.entityState;
            var theseAreTheDroidsYoureLookingFor = entityState.isAdded() || entityState.isModified();
            if (!theseAreTheDroidsYoureLookingFor) { return key; }
            if (!key) { key = storeConfig.newGuid(); }
            var exportData = manager.exportEntities([entity], false);
            saveToWipLocalStorage(key, exportData);
            storeWipSummary(entity, key, entityName, description, routeState);
            return key;
        }

        function importWipData(key) {
            var importedData = $window.localStorage.getItem(key);
            importedData = zStorageCore.checkStoreImportVersionAndParseData(importedData);
            var hasData = !!importedData;
            if (hasData) {
                var importResults = manager.importEntities(importedData);
                var importedEntity = importResults.entities[0];
                return importedEntity;
            }
            return null;
        }

        function saveToWipLocalStorage(key, data) {
            var meta = { // trimmed
                breezeVersion: zStorageCore.storeMeta.breezeVersion,
                breezeMetadataVersion: zStorageCore.storeMeta.breezeMetadataVersion,
                appVersion: zStorageCore.storeMeta.appVersion
            };
            $window.localStorage.setItem(key, zStorageCore.formatStorageData(meta, data));
        }

        function storeWipSummary(entity, key, entityName, description, routeState) {
            var wipHeader = {
                id: entity.id,
                date: new Date(),
                key: key,
                routeState: routeState,
                state: entity.entityAspect.entityState.name,
                entityName: entityName,
                description: description
            };
            var wipSummary = getWipSummary();
            var exists = wipSummary.some(function (item) {
                return item.key === wipHeader.key;
            });
            if (!exists) {
                wipSummary.push(wipHeader);
                $window.localStorage.setItem(wipKey, JSON.stringify(wipSummary));
            }
            zStorageCore._broadcast(storeConfig.events.wipChanged, 'saved', wipSummary);
        }
    }
})();