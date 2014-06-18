/*
 * SPAGHETTI CODE
 *
 * Do not use this!
 * Use sessions.js instead.
 *
 * Pure example of making a controller do all the work and not delegating to dependencies.
 * We lose code reuse, make it difficult to test, difficult to maintain,
 * and increases the chances for introducing bugs since the code is duplicated.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('Sessions', ['$location', '$q', '$routeParams', Sessions]);

    function Sessions($location, $q, $routeParams) {
        /*jshint validthis: true */
        var vm = this;
        var applyFilter = function () {};

        /***************************************************************************
         * Good candidate for a constant in a common module
         ***************************************************************************/
        var keyCodes = {
            backspace: 8,
            tab: 9,
            enter: 13,
            esc: 27,
            space: 32,
            pageup: 33,
            pagedown: 34,
            end: 35,
            home: 36,
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            insert: 45,
            del: 46
        };
        var useManualMetadata = true;
        var metadataStore = createMetadataStore();
        var Validator = breeze.Validator,
            requireReferenceValidator,
            twitterValidator;


        vm.filteredSessions = [];
        vm.gotoSession = gotoSession;
        vm.refresh = refresh;
        vm.search = search;
        vm.sessions = [];
        vm.sessionsFilter = sessionsFilter;
        vm.sessionsSearch = $routeParams.search || '';
        vm.title = 'Sessions';

        activate();

        function activate() {
            var promises = [getSessions()];

            /***************************************************************************
             * Most controllers will need something like this logic.
             * Good candidate for a controllerActivation factory in a common module
             ***************************************************************************/
            return $q.all(promises).then(function(eventArgs) {
                var data = { controllerId: controllerId };
                $rootScope.$broadcast('controller.activateSuccess', data);
                applyFilter = createSearchThrottle('sessions');
                if (vm.sessionsSearch) {
                    applyFilter(true /*now*/);
                }
                var msg = 'Activated Sessions View';
                toastr.info(msg);
                $log.info(msg);
            });
        }

        /***************************************************************************
         * Good candidate for a searchHelper factory in a common module
         ***************************************************************************/
        function createSearchThrottle(list, filteredList, filter, delay) {
            // After a delay, search a viewmodel's list using
            // a filter function, and return a filteredList.

            // createSearchThrottle uses values by convention, via its parameters:
            //     vm.sessionsSearch is where the user enters the search
            //     vm.sessions is the original unfiltered array
            //     vm.filteredSessions is the filtered array
            //     vm.sessionsFilter is the filtering function


            // custom delay or use default
            delay = +delay || 300;
            // if only vm and list parameters were passed, set others by naming convention
            if (!filteredList) {
                // assuming list is named sessions, filteredList is filteredSessions
                filteredList = 'filtered' + list[0].toUpperCase() + list.substr(1).toLowerCase(); // string
                // filter function is named sessionFilter
                filter = list + 'Filter'; // function in string form
            }

            // create the filtering function we will call from here
            var filterFn = function () {
                // translates to ...
                // vm.filteredSessions
                //      = vm.sessions.filter(function(item( { returns vm.sessionFilter (item) } );
                vm[filteredList] = vm[list].filter(function (item) {
                    return vm[filter](item);
                });
            };

            return (function () {
                // Wrapped in outer IFFE so we can use closure
                // over filterInputTimeout which references the timeout
                var filterInputTimeout;

                // return what becomes the 'applyFilter' function in the controller
                return function (searchNow) {
                    if (filterInputTimeout) {
                        $timeout.cancel(filterInputTimeout);
                        filterInputTimeout = null;
                    }
                    if (searchNow || !delay) {
                        filterFn();
                    } else {
                        filterInputTimeout = $timeout(filterFn, delay);
                    }
                };
            })();
        }

        /***************************************************************************
         * Good candidate for a data factory in a app common module
         ***************************************************************************/
        function getPartials(forceRemote) {
            var entityName = 'Session';
            var orderBy = 'timeSlot.start, speaker.firstName, title';
            var sessions;
            var sessionsQuery = breeze.EntityQuery.from('Sessions');
            var manager = newManager();

            if (base.zStorage.areItemsLoaded('sessions') && !forceRemote) {
                sessions = base.getAllLocal(entityName, orderBy);
                return base.$q.when(sessions);
            }

            return sessionsQuery
                .select('id, title, code, speakerId, trackId, timeSlotId, roomId, level, tags')
                .orderBy(orderBy)
                .toType(entityName)
                .using(manager).execute()
                .then(success).catch(base.queryFailed);

            function success(response) {
                sessions = base.setIsPartialTrue(response.results);
                mongoSessionSort(sessions);
                base.zStorage.areItemsLoaded('sessions', true);
                base.logger.info('Retrieved [Session Partials] from remote data source', sessions.length);
                base.zStorage.save();
                return sessions;
            }

        }

        function getSessions(forceRefresh) {
            return getPartials(forceRefresh).then(function (data) {
                vm.sessions = vm.filteredSessions = data;
                return vm.sessions;
            });
        }

        function gotoSession(session) {
            if (session && session.id) {
                $location.path('/session/' + session.id);
            }
        }

        function refresh() {
            getSessions(true);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.sessionsSearch = '';
                applyFilter(true /*now*/);
            } else {
                applyFilter();
            }
        }

        function sessionsFilter(session) {
            var searchText = vm.sessionsSearch;
            var isMatch = searchText ? textContains(session.title, searchText) ||
                textContains(session.tagsFormatted, searchText) ||
                textContains(session.room.name, searchText) ||
                textContains(session.track.name, searchText) ||
                textContains(session.speaker.fullName, searchText) : true;
            return isMatch;
        }


        //#region Common data and model tasks.
        /***************************************************************************
         * Good candidate for a model factory in a app common module
         ***************************************************************************/
        function createMetadataStore() {
            var store = new breeze.MetadataStore();
            configureMetadataStore(store);
            if (useManualMetadata) {
                store.addDataService(new breeze.DataService({ serviceName: serviceName }));
            }
            return store;
        }

        function newManager() {
            var mgr = new breeze.EntityManager({
                serviceName: 'breeze/Breeze',
                metadataStore: metadataStore
            });
            return mgr;
        }

        function configureMetadataStore(metadataStore) {
            // Pass the Type, Ctor (breeze tracks properties created here), and initializer
            // Assume a Session or Person is partial by default
            registerSession(metadataStore);
            registerPerson(metadataStore);
            registerTimeSlot(metadataStore);

            /*
             * Where would validation go?
             */
            createAndRegister(entityNames);

            if (useManualMetadata) {
                manualMetadata.fillMetadataStore(metadataStore);
                extendMetadata(metadataStore);
            }
        }

        function extendMetadata(metadataStore) {
            /*
             * Where would validation go?
             */
            applyValidators(metadataStore);

            registerResourceNames(metadataStore);
        }

        function createNullos(manager) {
            if (nullosExist) {
                return;
            }
            nullosExist = true;
            var unchanged = breeze.EntityState.Unchanged;

            createNullo(entityNames.timeslot, { start: nulloDate, isSessionSlot: true });
            createNullo(entityNames.room);
            createNullo(entityNames.speaker, { firstName: ' [Select a person]' });
            createNullo(entityNames.track);

            function createNullo(entityName, values) {
                var initialValues = values || { name: ' [Select a ' + entityName.toLowerCase() + ']' };
                return manager.createEntity(entityName, initialValues, unchanged);
            }
        }

        // Wait to call until entityTypes are loaded in metadata
        function registerResourceNames(metadataStore) {
            // every entityName is its own resource name
            var types = metadataStore.getEntityTypes();
            types.forEach(function (type) {
                if (type instanceof breeze.EntityType) {
                    set(type.shortName, type);
                }
            });

            var personEntityName = 'Person';
            ['Speakers', 'Speaker', 'Attendees', 'Attendee'].forEach(function (r) {
                set(r, personEntityName);
            });

            function set(resourceName, entityName) {
                metadataStore.setEntityTypeForResourceName(resourceName, entityName);
            }
        }

        function registerSession(metadataStore) {
            metadataStore.registerEntityTypeCtor('Session', Session);

            function Session() {
                this.isPartial = false; // presume full session objects until informed otherwise
            }

            Object.defineProperty(Session.prototype, 'tagsFormatted', {
                get: function () {
                    return this.tags ? this.tags.replace(/\|/g, ', ') : this.tags;
                },
                set: function (value) {
                    this.tags = value.replace(/\, /g, '|');
                }
            });
        }

        function registerPerson(metadataStore) {
            metadataStore.registerEntityTypeCtor('Person', Person);

            function Person() {
                this.isPartial = false;
                this.isSpeaker = false;
            }

            Object.defineProperty(Person.prototype, 'fullName', {
                get: function () {
                    var fn = this.firstName;
                    var ln = this.lastName;
                    return ln ? fn + ' ' + ln : fn;
                }
            });

        }

        function registerTimeSlot(metadataStore) {
            metadataStore.registerEntityTypeCtor(
                'TimeSlot', TimeSlot);

            function TimeSlot() {
            }

            Object.defineProperty(TimeSlot.prototype, 'name', {
                get: function () {
                    var start = this.start;
                    var value = ((start - nulloDate) === 0) ?
                        ' [Select a timeslot]' :
                        (start && moment.utc(start).isValid()) ?
                            moment.utc(start).format('ddd hh:mm a') : '[Unknown]';
                    return value;
                }
            });
        }
        //#endregion

        function mongoSessionSort(sessions){
            // must sort sessions locally
            // because MongoDb lacks relationships to TimeSlot and Speaker
            // so it can't perform the proper sort on the data tier
            // This sort should reproduce effect of 'orderBy' in repository.session.js
            sessions.sort(function(left, right){
                if (left.timeSlot.start < right.timeSlot.start) {return -1;}
                if (left.timeSlot.start > right.timeSlot.start) {return 1;}
                if (left.speaker.firstName < right.speaker.firstName) {return -1;}
                if (left.speaker.firstName > right.speaker.firstName) {return 1;}
                if (left.title < right.title) {return -1;}
                return (left.title > right.title) ? 1 : 0;
            });
        }



        /***************************************************************************
         * Good candidate for a stringHelper factory in a common module
         ***************************************************************************/
        function textContains(text, searchText) {
            return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
        }




         /***************************************************************************
          * Good candidate for a validation factory in a app common module
          ***************************************************************************/
        //#region Validation
        function applyValidators(metadataStore) {
            applyRequireReferenceValidators(metadataStore);
            applyTwitterValidators(metadataStore);
            applyEmailValidators(metadataStore);
            applyUrlValidators(metadataStore);
            log('Validators applied', null);
        }

        function createAndRegister(eNames) {
            entityNames = eNames;
            // Step 1) Create it
            requireReferenceValidator = createRequireReferenceValidator();
            twitterValidator = createTwitterValidator();
            // Step 2) Tell breeze about it
            Validator.register(requireReferenceValidator);
            Validator.register(twitterValidator);
            // Step 3) Later we will apply them to the properties/entities via applyValidators
            log('Validators created and registered', null);
        }

        function applyEmailValidators(metadataStore) {
            var entityType = metadataStore.getEntityType(entityNames.speaker);
            entityType.getProperty('email').validators.push(Validator.emailAddress());
        }

        function applyRequireReferenceValidators(metadataStore) {
            var navigations = ['room', 'track', 'timeSlot', 'speaker'];
            var entityType = metadataStore.getEntityType(entityNames.session);

            navigations.forEach(function (propertyName) {
                entityType.getProperty(propertyName).validators
                    .push(requireReferenceValidator);
            });
        }

        function applyTwitterValidators(metadataStore) {
            var entityType = metadataStore.getEntityType(entityNames.speaker);
            entityType.getProperty('twitter').validators.push(twitterValidator);
        }

        function applyUrlValidators(metadataStore) {
            var entityType = metadataStore.getEntityType(entityNames.speaker);
            entityType.getProperty('blog').validators.push(Validator.url());
        }

        function createTwitterValidator() {
            var val = Validator.makeRegExpValidator(
                'twitter',
                /^@([a-zA-Z]+)([a-zA-Z0-9_]+)$/,
                'Invalid Twitter User Name: "%value%"');
            return val;
        }

        function createRequireReferenceValidator() {
            var name = 'requireReferenceEntity';
            // isRequired = true so zValidate directive displays required indicator
            var ctx = { messageTemplate: 'Missing %displayName%', isRequired: true };
            var val = new Validator(name, valFunction, ctx);
            return val;

            // passes if reference has a value and is not the nullo (whose id===0)
            function valFunction(value) {
                return value ? value.id !== 0 : false;
            }
        }
        //#endregion

    }
})();