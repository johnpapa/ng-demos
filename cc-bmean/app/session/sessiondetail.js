(function () {
    'use strict';

    var controllerId = 'sessiondetail';
    angular.module('app').controller(controllerId,
        ['$location', '$scope', '$routeParams', '$window',
            'bootstrap.dialog', 'common', 'config', 'datacontext', 'helper', 'model', sessiondetail]);

    function sessiondetail($location, $scope, $routeParams, $window,
                           bsDialog, common, config, datacontext, helper, model) {
        var vm = this;
        var entityName = model.entityNames.session;
        var logError = common.logger.error;
        var logWarning = common.logger.warn;
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
            //routemediator.register(vm);
            initLookups();
            onDestroy();
            onHasChanges();
            // Whether we succeed or fail, we still want to call onEveryChange
            common.activateController([getRequestedSession()], controllerId)
                .then(onEveryChange);
        }

        function autoStoreWip(immediate) {
            common.debouncedThrottle(controllerId, storeWipEntity, 1000, immediate);
        }

        function cancel() {
            datacontext.cancel();
            removeWipEntity();
            helper.replaceLocationUrlGuidWithId(vm.session.id);
            if (vm.session.entityAspect.entityState.isDetached()) {
                gotoSessions();
            }
        }

        function gotoSessions() {
            $location.path('/sessions');
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
                        logWarning('Could not find session id = ' + val);
                        gotoSessions();
                    }
                })
                .catch(function (error) {
                    logError('Error while getting session id = ' + val + '; ' + error);
                    gotoSessions();
                });
        }

        function goBack() {
            $window.history.back();
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

        function onEveryChange() {
            $scope.$on(config.events.entitiesChanged,
                function (event, data) {
                    autoStoreWip();
                });
        }

        function onDestroy() {
            $scope.$on('$destroy', function () {
                autoStoreWip(true);
                datacontext.cancel();
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
                helper.replaceLocationUrlGuidWithId(vm.session.id);
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

        //#region canDeactivate - dead code
        //function ___canDeactivate() {
        //    var deferred = $q.defer();

        //    if (vm.isDeleting) {
        //        deferred.reject('Is Deleting');
        //        return deferred.promise;
        //    }
        //    if (!vm.hasChanges) {
        //        deferred.resolve('Has no changes, let em go');
        //        return deferred.promise;
        //    }

        //    var title = 'Do you want to leave "' + vm.session.title + '" ?';
        //    var msg = 'Navigate away and cancel your changes?';
        //    var btns = [{ result: 'no', label: 'No' },
        //        { result: 'yes', label: 'Yes', cssClass: 'btn-primary' }];

        //    $dialog.messageBox(title, msg, btns)
        //        .open().then(function (result) {
        //            if (result.toLowerCase() === 'yes') {
        //                cancel();
        //                deferred.resolve('Allow leave, canceled changes');
        //            } else {
        //                var msg = 'You can check out any time you like, but you can never leave! [sessiondetail.js]';
        //                logger.logWarning(msg, null, controllerId, true);
        //                deferred.reject('User decided to stay on screen');
        //            }
        //        });
        //    return deferred.promise;
        //}
        //#endregion
    }
})();