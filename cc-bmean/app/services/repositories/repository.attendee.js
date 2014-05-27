(function () {
    'use strict';

    var serviceId = 'repository.attendee';
    angular.module('app').factory(serviceId,
        ['breeze', 'model', 'repository.abstract', RepositoryAttendee]);

    function RepositoryAttendee(breeze, model, AbstractRepository) {
        var attendeesQuery = breeze.EntityQuery.from('Persons');
        var entityName = model.entityNames.attendee;
        var orderBy = 'firstName, lastName';

        return {
            create: createRepo // factory function to create the repository
        };

        /* Implementation */
        function createRepo(manager) {
            var base = new AbstractRepository(manager, entityName, serviceId);
            var count;
            var repo = {
                getAll: getAll,
                getCount: getCount,
                getFilteredCount: getFilteredCount
            };

            return repo;

            function fullNamePredicate(filterValue) {
                return breeze.Predicate
                    .create('firstName', 'contains', filterValue)
                    .or('lastName', 'contains', filterValue);
            }

            function getAll(forceRemote, page, size, nameFilter) {
                // Only return a page worth of attendees
                var take = size || 20;
                var skip = page ? (page - 1) * size : 0;

                if (base.zStorage.areItemsLoaded('attendees') && !forceRemote) {
                    // Get the page of attendees from local cache
                    return base.$q.when(getByPage());
                }

                // Load all attendees to cache via remote query
                return attendeesQuery
                    .select('id, firstName, lastName, imageSource')
                    .orderBy(orderBy)
                    .toType(entityName)
                    .using(base.manager).execute()
                    .then(querySucceeded).catch(base.queryFailed);

                function querySucceeded(data) {
                    var attendees = base.setIsPartialTrue(data.results);
                    base.zStorage.areItemsLoaded('attendees', true);
                    base.log('Retrieved [Attendees] from remote data source', attendees.length);
                    base.zStorage.save();
                    return getByPage();
                }

                function getByPage() {
                    var predicate = base.predicates.isNotNullo;

                    if (nameFilter) {
                        predicate = predicate.and(fullNamePredicate(nameFilter));
                    }

                    var attendees = attendeesQuery
                        .where(predicate)
                        .orderBy(orderBy)
                        .take(take).skip(skip)
                        .using(base.manager)
                        .executeLocally();

                    return attendees;
                }

            }

            function getCount() {
                if (base.zStorage.areItemsLoaded('attendees')) {
                    return base.$q.when(base.getLocalEntityCount(entityName));
                }
                if (count !== undefined) {
                    return base.$q.when(count);
                }
                // Attendees aren't loaded and don't have a count yet;
                // ask the server for a count and remember it
                return attendeesQuery.take(0).inlineCount()
                    .using(base.manager).execute()
                    .then(function (data) {
                        count = data.inlineCount;
                        return count;
                    });
            }

            function getFilteredCount(nameFilter) {
                var predicate = breeze.Predicate
                    .and(base.predicates.isNotNullo)
                    .and(fullNamePredicate(nameFilter));

                var attendees = attendeesQuery
                    .where(predicate)
                    .using(base.manager)
                    .executeLocally();

                return attendees.length;
            }
        }
    }
})();