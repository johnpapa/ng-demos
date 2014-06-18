(function () {
    'use strict';

    angular
        .module('app')
        .controller('sessiondetail',
            ['$location', '$scope', '$routeParams', '$window',
            'bootstrap.dialog', 'common', 'config', 'datacontext', 'model', sessiondetail]);

    function sessiondetail($location, $scope, $routeParams, $window,
                           bsDialog, common, config, datacontext, model) {
        /*jshint validthis: true */
        var vm = this;
        var entityName = model.entityNames.session;
        var logger = common.logger;
        var $q = common.$q;
        var wipEntityKey;

        vm.cancel = cancel;
        vm.deleteSession = deleteSession;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.rooms = [];
        vm.save = save;
        vm.session = undefined;
        vm.speakers = [];
        vm.timeslots = [];
        vm.tracks = [];

        Object.defineProperty(vm, 'canSave', { get: canSave });

        activate();

        function activate() {
            initLookups();
            onDestroy();
            onHasChanges();
            // Whether we succeed or fail, we still want to call onEveryChange
            datacontext.ready([getRequestedSession()]).then(onEveryChange);
        }

        function autoStoreWip(immediate) {
            common.debouncedThrottle(controllerId, storeWipEntity, 1000, immediate);
        }

        function cancel() {
            datacontext.cancel();
            removeWipEntity();
            common.replaceLocationUrlGuidWithId(vm.session.id);
            if (vm.session.entityAspect.entityState.isDetached()) {
                gotoSessions();
            }
        }

        function canSave() {
            return vm.hasChanges && !vm.isSaving;
        }

        function deleteSession() {
            return bsDialog.deleteDialog('Session')
                .then(confirmDelete);

            function confirmDelete() {
                datacontext.markDeleted(vm.session);
                vm.save().then(success).catch(failed);

                function success() {
                    removeWipEntity();
                    gotoSessions();
                }

                function failed(error) {
                    cancel(); // Makes the entity available to edit again
                }
            }
        }

        function getRequestedSession() {
            var val = $routeParams.id;
            if (val === 'new') {
                vm.session = datacontext.session.create();
                return vm.session;
            }

            return datacontext.session.getEntityByIdOrFromWip(val)
                .then(function (data) {
                    if (data) {
                        // data is either an entity or an {entity, wipKey} pair
                        wipEntityKey = data.key;
                        vm.session = data.entity || data;
                    } else {
                        logger.warning('Could not find session id = ' + val);
                        gotoSessions();
                    }
                })
                .catch(function (error) {
                    logger.error('Error while getting session id = ' + val + '; ' + error);
                    gotoSessions();
                });
        }

        function goBack() {
            $window.history.back();
        }

        function gotoSessions() {
            $location.path('/sessions');
        }

        function initLookups() {
            // Get the lookups lists and their nullo option
            var lookups = datacontext.lookup.cachedData;
            vm.rooms = lookups.rooms;
            vm.timeslots = lookups.timeslots;
            vm.tracks = lookups.tracks;
            // Get all speakers from cache (they are local already)
            vm.speakers = datacontext.speaker.getAllLocal(true);
        }

        function onDestroy() {
            $scope.$on('$destroy', function () {
                autoStoreWip(true);
                datacontext.cancel();
            });
        }

        function onEveryChange() {
            $scope.$on(config.events.entitiesChanged,
                function (event, data) {
                    autoStoreWip();
                });
        }

        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged,
                function (event, data) {
                    vm.hasChanges = data.hasChanges;
                });
        }

        function removeWipEntity() {
            datacontext.zStorageWip.removeWipEntity(wipEntityKey);
        }

        function save() {
            if (!canSave()) {
                return $q.when(null);
            } // Must return a promise

            vm.isSaving = true;
            return datacontext.save().then(function (saveResult) {
                vm.isSaving = false;
                removeWipEntity();
                common.replaceLocationUrlGuidWithId(vm.session.id);
                datacontext.speaker.calcIsSpeaker();
            }).catch(function (error) {
                    vm.isSaving = false;
                });
        }

        function storeWipEntity() {
            if (!vm.session) {
                return;
            }
            var description = vm.session.title || '[New Session]' + vm.session.id;
            wipEntityKey = datacontext.zStorageWip.storeWipEntity(vm.session, wipEntityKey, entityName, description);
        }
    }
})();