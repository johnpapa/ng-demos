/*
 * wip ("Work in Progress") service stashes changed entities in browser local storage.
 * This simple version works for one EntityManager only and automatically captures changes
 * to that manager in a throttled way.
 */
(function (){
    'use strict';
    angular.module('app').factory('wip-service',
        ['$log','$rootScope','$timeout','$window', 'breeze', service]);

    function service($log, $rootScope, $timeout, $window, breeze){

        var wip = {
            clear: clearWip,
            eventName: function() {return eventName;},
            initialize: initialize,
            isEnabled: function() {return !disabled;},
            isStopped: function() {return !!stopped;},
            restore: restore,
            resume: resume,
            stashCount: function() {return stashCount;},
            start: resume, //alias
            stop: stop
        };

        var db = $window.localStorage;
        var delay = 3000; // debounce for 3 seconds
        var disabled = undefined;
        var entityChangedToken = undefined;
        var eventName = "WIP";
        var isRestoring = false;
        var manager = undefined;
        var propChangeAction = breeze.PropertyChange;
        var priorTimeout = undefined;
        var stashName = "wip";
        var stashTypes = [];
        var stopped = false;
        var stashCount = undefined;

        return wip;
        ///////////////////////
        function clearWip(){
            if (disabled) {return;}
            try {
               db.removeItem(stashName);
               stashCount = 0;
               sendWipMessage('Cleared WIP stash');
            } catch(e) { stashCount= undefined; /* err doesn't matter */}
        }




        function entityChanged(changeArgs){
            if (isRestoring || stopped) {return;} // ignore WIP service's own changes.
            var action = changeArgs.action;


            if (action === propChangeAction ){
                $timeout.cancel(priorTimeout);
                priorTimeout = $timeout(stash, delay, true);
            }
        }




        function initialize(entityManager){
            if (typeof disabled === 'boolean') {
                throw new Error("WIP already enabled, can't enable twice.");
            }
            if (!db){
                disabled = true;
                stashCount = 0;
                $log.error("Browser does not support local storage; WIP disabled.")
            } else {
                manager = entityManager;
                listenForChanges();
                disabled = false;
                sendWipMessage('WIP enabled');
            }
        }

        function listenForChanges(){
            if (entityChangedToken) { return; } // already listening
            entityChangedToken = manager.entityChanged.subscribe(entityChanged);
            disabled = false;
        }

        function restore(){
            var imports = [];
            stashCount = 0;
            if (disabled) {return imports;}
            // imports changes from stash
            isRestoring = true;
            try {
                var changes = db.getItem(stashName);
                if (changes){


                    // should confirm that metadata and app version
                    // are still valid but this is a demo
                    imports = manager.importEntities(changes).entities;



                    stashCount = imports.length;
                    sendWipMessage('Restored '+stashCount+' change(s) from stash');
                } else {
                    sendWipMessage('Restore found no stashed changes');
                }
            } catch (error){ /* log but don't crash */
                $log.error('WIP restore failed');
                $log.error(error);
            } finally {
                isRestoring = false;
            }
            return imports;
        }

        function resume(){
            if (!disabled && stopped) {
                stopped = false;
                stash();
                listenForChanges();
                sendWipMessage('WIP re-enabled');
            }
        }

        function sendWipMessage(message){
            $log.log('WIP event: "'+message+'"');
            $rootScope.$broadcast(eventName, message);
        }

        function stash(){
            if (manager.hasChanges()){


                // export changes w/o metadata
                // Get only these entity types
                // (which we only have 1 in this app)
                var changes = manager.getChanges();


                stashCount = changes.length;
                sendWipMessage('Stashing '+ stashCount +' change(s)');



                var exported = manager.exportEntities(changes, false);



                // should stash with metadata and app version but this is a demo
                db.setItem(stashName, exported);
            } else  if (stashCount !== 0){
                sendWipMessage('No changes; clearing stash');
                db.removeItem(stashName);
                stashCount = 0;
            }

        }

        function stop(){
            if (!disabled && !stopped) {
                stopped = true;
                stopListeningForChanges();
                sendWipMessage('WIP has been stopped');
            }
        }

        function stopListeningForChanges() {
            manager.entityChanged.unsubscribe(entityChangedToken);
            entityChangedToken = undefined;
        }
    }
})();