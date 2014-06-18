(function () {
    'use strict';

    angular
        .module('app.data')
        .factory('repository.speaker',
            ['breeze', 'model', 'repository.abstract', RepositorySpeaker]);

    function RepositorySpeaker(breeze, model, AbstractRepository) {
        var entityName = model.entityNames.speaker;
        var orderBy = 'firstName, lastName';

        return {
            create: createRepo // factory function to create the repository
        };

        /* Implementation */
        function createRepo(manager) {
            var base = new AbstractRepository(manager, entityName);

            // Using the type is a little faster than the the type name
            // worth doing when frequently called as in 'calcIsSpeaker'
            var metadataStore = manager.metadataStore;
            var personType = metadataStore.getEntityType(model.entityNames.person);
            var sessionType = metadataStore.getEntityType(model.entityNames.session);

            var repo = {
                calcIsSpeaker: calcIsSpeaker,
                create: create,
                getAllLocal: getAllLocal,
                getById: base.getById,
                getEntityByIdOrFromWip: base.getEntityByIdOrFromWip,
                getPartials: getPartials,
                getTopLocal: getTopLocal
            };

            return repo;

            function calcIsSpeaker() {
                // Call this when you need to reset the isSpeaker flag.
                // EX:  session changes (maybe we changed the speaker).
                //      session is deleted (speaker may not have sessions anymore)

                // get cached Person and Session entities
                var persons = manager.getEntities(personType);
                var sessions = manager.getEntities(sessionType);

                // get them via local query
                //var persons = breeze.EntityQuery.from('Persons')
                //    .using(manager).executeLocally();
                //var sessions = breeze.EntityQuery.from('Sessions')
                //    .using(manager).executeLocally();

                // clear 'isSpeaker' value for all persons, then
                // reassign based on who has a session now (excluding the nullo)
                persons.forEach(function (s) {
                    s.isSpeaker = false;
                });
                sessions.forEach(function (s) {
                    s.speaker.isSpeaker = (s.speakerId !== 0);
                });
            }

            function create() {
                return manager.createEntity(personType);
            }

            function getAllLocal(includeNullo) {
                var predicate = breeze.Predicate.create('isSpeaker', '==', true);
                if (includeNullo) {
                    predicate = predicate.or(base.predicates.isNullo);
                }
                return base.getAllLocal(entityName, orderBy, predicate);
            }

            function getPartials(forceRemote) {
                var speakers;
                if (!forceRemote) {
                    speakers = getAllLocal(/*includeNullo*/ false);
                    if (speakers.length) {
                        return base.$q.when(speakers);
                    } //unlike sessions, if we have one, we have them all
                }

                return breeze.EntityQuery.from('Speakers')
                    .select('id, firstName, lastName, imageSource')
                    .orderBy(orderBy)
                    .toType(personType)
                    .using(manager).execute()
                    .then(querySucceeded).catch(base.queryFailed);

                function querySucceeded(data) {
                    speakers = data.results;
                    for (var i = speakers.length; i--;) {
                        speakers[i].isPartial = true;
                        speakers[i].isSpeaker = true;
                    }
                    base.logger.info('Retrieved [Speaker Partials] from remote data source', speakers.length);
                    base.zStorage.save();
                    return speakers;
                }
            }

            function getTopLocal() {
                var predicate = breeze.Predicate
                    .create('lastName', '==', 'Papa')
                    .or('lastName', '==', 'Guthrie')
                    .or('lastName', '==', 'Bell')
                    .or('lastName', '==', 'Hanselman')
                    .or('lastName', '==', 'Green')
                    .or('lastName', '==', 'Lerman')
                    .and('isSpeaker', '==', true);

                return base.getAllLocal(entityName, orderBy, predicate);
            }
        }
    }
})();