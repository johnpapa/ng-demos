/*
 * Intro to Angular async-dodging
 */
describe('angular async dodging', function() {
    'use strict';

    describe("angular-mocks are synchronous", function () {

        var $q, $rootScope, $timeout, specIndex = 0, wasCalled;

        /* The setup and teardown */
        beforeEach(inject(function(_$q_, _$rootScope_, _$timeout_){
            // using angular.mock inject
            $q = _$q_;
            $rootScope =_$rootScope_;
            $timeout = _$timeout_;

            console.log('\nbefore spec '+specIndex);
            wasCalled = false;
        }));

        afterEach(function(){
            console.log('after spec '+specIndex);
            if (!wasCalled){ expect.toFail("success was not called"); }
            specIndex += 1;
        });

        /* specs */

        it("$timeout.flush() makes it so", function () {
            var success = function (){
                console.log('    success called in spec ' + specIndex);
                wasCalled = true;
            };

            $timeout(success, 10000000);   // wait a loooooooong time

            expect(wasCalled).toBe(false);

            $timeout.flush();             // flushes the timeout clock

            expect(wasCalled).toBe(true);

        });

        it("flushing the promise queue makes it so", function () {
            var success = function (){
                console.log('    success called in spec ' + specIndex);
                wasCalled = true;
            };

            var deferred = $q.defer();
            deferred.promise.then(success);
            deferred.resolve();   // simulate something async completed

            // COMMENT OUT TO MAKE IT FAIL
            $rootScope.$apply(); // flushes promise queue; then(success)

        });

    });

    var currentSuite = describe('learning the Jasmine async syntax', function() {

        // No Angular here; just Jasmine

        var activeSpecs, specIndex = 0, exitedProperly = [];

        beforeEach(function(){
            findActiveSpecs();
            specStarted();
            exitedProperly[specIndex] = false;
        });

        afterEach(function () {
            specExited();
            expect(exitedProperly[specIndex]).toBe(true);
            specIndex += 1;
        });


        // WITHOUT Async syntax (enable by changing 'xit'->'it' and watch it fail
        xit('exits spec too soon; spec before callback', function () {
            var specName = getSpecName();
            setTimeout(function () {  // the REAL setTimeout, not ng mock $timeout
                console.log("setTimeout called in "+specName);
                exitedProperly[specIndex] = true;
            }, 100);
        });



        // WITH Async syntax
        it('can wait for setTimeout', function (done) {
            var specName = getSpecName();
            setTimeout(function () {  // the REAL setTimeout, not ng mock $timeout
                console.log("setTimeout called in "+specName);
                exitedProperly[specIndex] = true;
                done(); // THE KEY IS TO CALL 'DONE' HERE
            }, 100);
        });





        /* helpers */
        function getSpecName(){
            return "spec {0} (\"{1}\")"
                .format(specIndex, activeSpecs[specIndex].description);
        }

        function specStarted(){
            console.log("Started "+getSpecName());
        }

        function specExited(){
            var ok = exitedProperly[specIndex];
            if (ok){
                console.log("Exited properly " + getSpecName());
            } else {
                console.error("Exited too soon " + getSpecName());
            }
        }

        function findActiveSpecs(){
            // Jasmine tries to hide what suite and spec you're in
            // this backdoor hack will help us HERE (won't work everywhere!)
            activeSpecs = activeSpecs || currentSuite.children.filter(function (s){
                return !s.markedPending; });
        }

    });
});

