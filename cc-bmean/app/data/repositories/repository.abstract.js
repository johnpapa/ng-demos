(function () {
    'use strict';

    var serviceId = 'repository.abstract';
    angular.module('app.data').factory(serviceId,
        ['breeze', 'common', 'config', 'zStorage', 'zStorageWip', AbstractRepository]);

    function AbstractRepository(breeze, common, config, zStorage, zStorageWip) {
        var predicates = {
            isNotNullo: breeze.Predicate.create('id', '!=', 0),
            isNullo: breeze.Predicate.create('id', '==', 0)
        };
        var $q = common.$q;

        function Ctor(entityManager, entityName) {
            // instance members that are stateful
            this.entityName = entityName;
            this.getById = getById.bind(this);
            this.getEntityByIdOrFromWip = getEntityByIdOrFromWip.bind(this);
            this.logger = common.logger;
            this.manager = entityManager;
            this.queryFailed = queryFailed.bind(this); // Bind to self so we establish 'this' as the context
        }

        /* stateless methods that can be shared across all repos */
        Ctor.prototype = {
            constructor: Ctor,
            $q: $q,
            getAllLocal: getAllLocal,
            getLocalEntityCount: getLocalEntityCount,
            predicates: predicates,
            setIsPartialTrue: setIsPartialTrue,
            zStorage: zStorage,
            zStorageWip: zStorageWip
        };

        return Ctor;

        /* Implementation */

        function getAllLocal(resource, ordering, predicate) {
            return breeze.EntityQuery.from(resource)
                .where(predicate)
                .orderBy(ordering)
                .using(this.manager)
                .executeLocally();
        }

        function getById(id, forceRemote) {
            var self = this;
            var entityName = self.entityName;
            var manager = self.manager;
            if (!forceRemote) {
                // Check cache first (synchronous)
                var entity = manager.getEntityByKey(entityName, id);
                if (entity && !entity.isPartial) {
                    self.logger.info('Retrieved [' + entityName + '] id:' + entity.id + ' from cache.', entity);
                    if (entity.entityAspect.entityState.isDeleted()) {
                        entity = null; // hide session marked-for-delete
                    }
                    // Should not need to call $apply because it is synchronous
                    return $q.when(entity);
                }
            }

            // It was not found in cache, so let's query for it.
            // fetchEntityByKey will go remote because
            // 3rd parm is false/undefined.
            return manager.fetchEntityByKey(entityName, id)
                .then(querySucceeded).catch(self.queryFailed);

            function querySucceeded(data) {
                entity = data.entity;
                if (!entity) {
                    self.logger.info('Could not find [' + entityName + '] id:' + id, null);
                    return null;
                }
                entity.isPartial = false;
                self.logger.info('Retrieved [' + entityName + '] id ' + entity.id + ' from remote data source', entity);
                zStorage.save();
                return entity;
            }
        }

        function getEntityByIdOrFromWip(val) {
            var self = this;
            var entityName = self.entityName;
            // val could be an ID or a wipKey
            var wipEntityKey = val;

            if (common.isNumber(val)) {
                val = parseInt(val);
                wipEntityKey = zStorageWip.findWipKeyByEntityId(entityName, val);
                if (!wipEntityKey) {
                    // Returns a promise with the entity because
                    // the entity may be in storagelocal or remote (async).
                    // Bind to self so we establish 'this' as the context.
                    return getById.bind(self)(val);
                }
            }

            var wipResult = null;
            var importedEntity = zStorageWip.loadWipEntity(wipEntityKey);
            if (importedEntity) {
                // Need to re-validate the entity we are re-hydrating
                importedEntity.entityAspect.validateEntity();
                wipResult = { entity: importedEntity, key: wipEntityKey };
            } else {
                self.logger.info('Could not find [' + entityName + '] id in WIP:' + wipEntityKey, null);
            }
            return $q.when(wipResult);
        }

        function getLocalEntityCount(resource) {
            var entities = breeze.EntityQuery.from(resource)
                .where(predicates.isNotNullo)
                .using(this.manager)
                .executeLocally();
            return entities.length;
        }

        function queryFailed(error) {
            var msg = config.appErrorPrefix + 'Error retrieving data. ' + (error.message || '');
            this.logger.error(msg, error);
            return $q.reject(new Error(msg));
        }

        function setIsPartialTrue(entities) {
            // call for all "partial queries"
            for (var i = entities.length; i--;) {
                entities[i].isPartial = true;
            }
            return entities;
        }
    }
})();