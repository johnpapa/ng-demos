/*
 * Defines the AngularJS application module and initializes it
 */
(function( angular  ) {

    var app = angular.module( "app", [
        'breeze.angular',
        'ui.router',
        'ui.bootstrap' ] );

    app.run( ['appStart', function ( appStart ) {
        appStart.start();
    }]);
    
})( this.angular );
