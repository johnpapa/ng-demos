/* ngPromises.spec.js:
 *
 * ngMocks mocks angular's $q library so that functions
 * that "wait" for synchronously fulfilled $q promises
 * can be tested synchronously
 *
 * aside: "fulfilled" means either "resolved successfully" or "rejected"
 *
 * The mocked $q puts synchronously fulfilled promises in its queue
 * and you can flush that queue WITHOUT waiting for a JavaScript turn (a "tick")
 * by calling $rootScope.$digest (or the higher level $rootScope.$apply)
 *
 * You must ensure that all promises fulfilled immediately (synchronously).
 *
 * If that's not possible ... if any promise is in fact asynchronously fulfilled ...
 * you must write an async test.
 *
 * These points are illustrated here.
 */
describe("Basics - ng Promises:", function () {
    "use strict";

    var $q, $rootScope,
        bingo,
        deferred,
        flush;

    function sayBingo()         { bingo = 'bingo!'; }
    function saidBingo()        { expect(bingo).to.exist; }
    function haveNotSaidBingo() { expect(bingo).to.be.null; }

    // No module setup necessary; ng module implicit.

    beforeEach(inject(function (_$q_, _$rootScope_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        bingo = null;

        // create deferred and promise to sayBingo when/if resolved
        deferred = $q.defer();
        deferred.promise.then(sayBingo);

        flush = $rootScope.$apply.bind($rootScope);
    }));


    it("bingo when resolved promise is flushed", function () {
        deferred.resolve();
        flush();
        saidBingo();
    });


    it("no bingo when forget to flush", function () {
        deferred.resolve();

        // forgot to call flush()
        haveNotSaidBingo();

        flush();
        // now should have bingo
        saidBingo();
    });


    it("no bingo when rejected promise is flushed", function () {
        deferred.reject('Oh darn!');
        flush();

        haveNotSaidBingo();

        deferred.promise.catch(function(reason){
            expect(reason).to.be('Oh darn!');
        });
    });


    /// Async promises

    it("no bingo in a sync test of an async promise", function () {

        setTimeout(function(){
            deferred.resolve();
        }, 10); // test will have finished before promise is resolved.


        flush();
        // bingo is still null because promise wasn't fulfilled
        haveNotSaidBingo();
    });



    // The `done` parameter indicates mocha async test
    // The test must call 'done' when all async operations have finished
    // so that test runner can resume.
    it("bingo in an async test of an async promise", function (done) {

        setTimeout(function(){
            deferred.resolve();
            flush();     // must flush again to catch this resolve
            saidBingo();
            done();      // now the test is over
        }, 10);

        // pointless: bingo is still null because promise not yet fulfilled
        flush();
        haveNotSaidBingo();
    });
});
