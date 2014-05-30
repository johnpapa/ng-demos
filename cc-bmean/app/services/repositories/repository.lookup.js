(function () {
    'use strict';

    var serviceId = 'repository.lookup';
    angular.module('app').factory(serviceId,
        ['breeze', 'model', 'repository.abstract', RepositoryLookup]);

    function RepositoryLookup(breeze, model, AbstractRepository) {
        var entityName = 'lookups';
        var entityNames = model.entityNames;

        return {
            create: createRepo // factory function to create the repository
        };

        /* Implementation */
        function createRepo(manager) {
            var base = new AbstractRepository(manager, entityName);
            var cachedLookups;
            var repo = {
                getAll: getAll,
                get cachedData() {
                    return getCachedLookups();
                } // shortcut 'getter' syntax
            };

            return repo;

            function getAll() {
                return breeze.EntityQuery.from('Lookups')
                    .using(manager).execute()
                    .then(processLookups).catch(base.queryFailed);

                function processLookups(data) {
                    model.createNullos(manager);
                    base.logger.info('Retrieved lookups', data);
                    base.zStorage.save();
                    return true;
                }
            }

            function getCachedLookups() {
                if (!cachedLookups) {
                    cachedLookups = {
                        rooms: base.getAllLocal(entityNames.room, 'name'),
                        tracks: base.getAllLocal(entityNames.track, 'name'),
                        timeslots: base.getAllLocal(entityNames.timeslot, 'start')
                    };
                }
                return cachedLookups;
            }
        }
    }
})();