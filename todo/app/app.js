/*
 * Defines the AngularJS application module and initializes it
 */
if (!breeze.core.__isES5Supported){
    throw new Error("This app only runs on modern ECMAScript 5+ browser. It won't run on < IE9");
}
angular.module( 'app', ['ngAnimate', 'breeze.angular' ] );
