/*
 * Demonstrate ngMidwayTester for true async testing of Angular apps
 * Compare to sync test equivalents in 'intro.jasmine.async.spec.js'
 *
 * Tester By: Matias Niemelä: https://github.com/yearofmoo/ngMidwayTester
 * Available on nuget: http://www.nuget.org/packages/Angular.MidwayTester/
 */

describe('ngMidwayTester async intro', function() {
    'use strict';

    var $q, $rootScope, $timeout, tester, specIndex = 0,wasCalled;

    /* ngMidwayTester setup and teardown */
    beforeEach(function () {
        // create a new tester before each test
        tester = ngMidwayTester('ng'); // why 'ng'? it needs some kind of Angular module
    });

    afterEach(function () {
        // destroy the tester after each test
        // located here in the code base to remind you to write it
        tester.destroy();
        tester = null;
    });

    /* The 'usual' setup and teardown */
    beforeEach(function(){
        // using midway tester 'inject' instead of angular-mock 'inject'
        $q = tester.inject('$q');
        $rootScope = tester.inject('$rootScope');
        $timeout = tester.inject('$timeout');

        console.log('\nbefore spec '+specIndex);
        wasCalled = false;
    });

    afterEach(function(){
        console.log('after spec '+specIndex);
        expect(wasCalled).toBe(true);
        specIndex += 1;
    });

    /* specs */

    // Note the 'done' argument!
    it("$timeout is no longer a mock", function (done) {
        /*
         * LOOK IN BROWSER CONSOLE, NOT WEB STORM CONSOLE
         * WebStorm console doesn't display log order properly
         */

        var success = function (){
            console.log('    success called in spec ' + specIndex);
            wasCalled = true;
            done();                // Calling 'done' ends the spec
        };

        $timeout(success, 300);   // keep it short 'cause it will run

        expect(wasCalled).toBe(false);

        weAreWaiting(1)();
        $timeout(weAreWaiting(2), 50);
        $timeout(weAreWaiting(3), 0);

        function weAreWaiting(counter){
            return function() {
                console.log("    " + (counter ? "#"+counter : "") + " waiting ...");
            }
        }

    });

    // Note the 'done' argument!
   it("$q promises are no longer mocked", function (done) {
        var success = function (){
            console.log('    success called in spec ' + specIndex);
            wasCalled = true;
        };

        var deferred = $q.defer();
        deferred.promise.then(success)
                        .then(done);     // Calling 'done' ends the spec
        deferred.resolve();              // simulate something async completed

       /*** NO $rootScope.$apply() needed or wanted ***/
    });

});

