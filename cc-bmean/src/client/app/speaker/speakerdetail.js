(function() {
    'use strict';

    angular
        .module('app')
        .controller('SpeakerDetail', SpeakerDetail);

    SpeakerDetail.$inject = [
        '$location', '$scope', '$routeParams', '$window',
        'common', 'config', 'datacontext', 'model'
    ];

    function SpeakerDetail(
        $location, $scope, $routeParams, $window,
        common, config, datacontext, model) {
        /*jshint validthis: true */
        var vm = this;
        var entityName = model.entityNames.speaker;
        var logger = common.logger;
        var $q = common.$q;
        var wipEntityKey;

        vm.cancel = cancel;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.save = save;
        vm.speaker = null;
        vm.speakers = [];

        Object.defineProperty(vm, 'canSave', {get: canSave});

        activate();

        function activate() {
            onDestroy();
            onHasChanges();
//            TODO: Using a resolver on all routes or datacontext.ready in every controller
//            return datacontext.ready([getRequestedSpeaker()]).then(onEveryChange);
            return getRequestedSpeaker().then(onEveryChange);
        }

        function autoStoreWip(immediate) {
            common.debouncedThrottle('speakerdetail', storeWipEntity, 1000, immediate);
        }

        function cancel() {
            datacontext.cancel();
            removeWipEntity();
            common.replaceLocationUrlGuidWithId(vm.speaker.id);
            if (vm.speaker.entityAspect.entityState.isDetached()) {
                gotoSpeakers();
            }
        }

        function canSave() {
            return vm.hasChanges && !vm.isSaving;
        }

        function getRequestedSpeaker() {
            var val = $routeParams.id;
            if (val === 'new') {
                vm.speaker = datacontext.speaker.create();
                return vm.speaker;
            }

            return datacontext.speaker.getEntityByIdOrFromWip(val)
                .then(function(data) {
                    if (data) {
                        // data is either an entity or an {entity, wipKey} pair
                        wipEntityKey = data.key;
                        vm.speaker = data.entity || data;
                    } else {
                        logger.warning('Could not find session id = ' + val);
                        gotoSpeakers();
                    }
                })
                .catch(function(error) {
                    logger.error('Error while getting speaker id = ' + val + '; ' + error);
                    gotoSpeakers();
                });
        }

        function goBack() {
            $window.history.back();
        }

        function gotoSpeakers() {
            $location.path('/speakers');
        }

        function onDestroy() {
            $scope.$on('$destroy', function() {
                autoStoreWip(true);
                datacontext.cancel();
            });
        }

        function onEveryChange() {
            $scope.$on(config.events.entitiesChanged, function(event, data) {
                autoStoreWip();
            });
        }

        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged,
                function(event, data) {
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
            return datacontext.save().then(function(saveResult) {
                vm.isSaving = false;
                removeWipEntity();
                common.replaceLocationUrlGuidWithId(vm.speaker.id);
            }).catch(function(error) {
                vm.isSaving = false;
            });
        }

        function storeWipEntity() {
            if (!vm.speaker) {
                return;
            }
            var description = (vm.speaker.fullName || '[New speaker]') + ' ' + vm.speaker.id;
            var routeState = 'speaker';
            wipEntityKey = datacontext.zStorageWip.storeWipEntity(
                vm.speaker, wipEntityKey, entityName, description, routeState);
        }
    }
})();