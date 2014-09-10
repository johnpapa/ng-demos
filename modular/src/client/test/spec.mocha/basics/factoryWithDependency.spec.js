describe("Basics - factory w/ dependency", function () {
    //this.timeout(3000);  // can change the mocha timeout for any `describe` or `it`
    var $log,
        service;

    // the "factory" (AKA "service") to test
    function testService($log) {
        return {
            calc: calc
        };
        /////////////
        function calc(input, previousOutput){
            var inp =  +(input || 0);
            var prev = +(previousOutput || 0);
            var result = inp + prev;

            // use the dependency
            $log.log("calc("+input+", "+previousOutput+") => "+ result);

            return result;
        }
    }
    testService.$inject=['$log']; // not needed but ... shows you can

    /**
     *  Register our test service anonymously with `anguler.mock.module`.
     *  N.B.: We don't need to mention any other modules$
     *        because our test service doesn't depend on anything.
     */
    beforeEach(module(function($provide){
        $provide.factory('testService', testService);
    }));

    // The first `angular.mock.inject` closes module registration and modification
    beforeEach(inject(function(testService, _$log_){
        service = testService;
        $log = _$log_;  // grab the dependent service so we can have some fun
    }));

    describe("when using real dependency", function () {
        // will use the ngMocks $log which does NOT write to console
        it('calc(0)', function () {
            expect(service.calc(0)).to.equal(0);
        });
        it('calc(1)', function () {
            expect(service.calc(1)).to.equal(1);
        });
        it('$log is actually an ngMock which can tell us $log.log was called', function () {
            service.calc(1);
            // assert that the $log.log method was called exactly once
            expect($log.log.logs.length).to.equal(1);
        });
    });

    /*
    * Suppose $log was not a mock but a service that actually wrote to console
    * Let's spy on it
    */
    describe("when spying on real dependency", function () {
        var logSpy;

        beforeEach(function () {
            logSpy = sinon.spy($log, 'log');
        });

        // will use the ngMocks $log which does NOT write to console
        it('calc(0) called $log.log', function () {
            service.calc(0);
            expect(logSpy).to.have.been.called;
        });
        it('calc(0) called $log.log ($log.log is the spy)', function () {
            service.calc(1);
            expect($log.log).to.have.been.called;
        });
    });

});
