/*
 * The application startup function, called in the app module's run block
 * Created apart from app.js so it can be easily stubbed out
 * during testing or tested independently
 */
(function( angular  ) {

    angular.module( "app").factory('appStart',
        ['$rootScope', 'dataservice', 'util', factory]);

    function factory ($rootScope, dataservice, util){
        var config = util.config;
        var logger = util.logger;

        var appStart = {
            reportStateChangesEnabled: false,
            start: start
        };
        return appStart;
        //////////////
        function start ( ) {
            logger.info( "Zza SPA is loaded and running on " + util.config.server );

            // Trigger initial loading of data from server
            // The app may appear to be more responsive if loading happens in background
            // while the app launches on a splash page that doesn't actually need data.
            dataservice.ready();
            reportStateChanges();
        }

        // report to console when UI-Router state changes
        function reportStateChanges(){
            if (config.reportStateChanges) {
                appStart.reportStateChangesEnabled = true;
                $rootScope.$on('$stateChangeStart',
                    function(event, toState, toParams, fromState){
                        logger.log("stateChangeStart: from '"+fromState.name + "' to '"+ toState.name+"'");
                    });

                $rootScope.$on('$stateChangeError',
                    function(event, toState, toParams, fromState, fromParams, error){
                        logger.log("stateChangeError: from '"+fromState.name + "' to '"+ toState.name+"' with error: "+error);
                    });

                $rootScope.$on('$stateChangeSuccess',
                    function(event, toState, toParams, fromState){
                        logger.log("stateChangeSuccess: from '"+fromState.name + "' to '"+ toState.name+"' with params " +
                            JSON.stringify(toParams));
                    });
            }
        }
    }
})( this.angular );
