describe("Basics - factory", function () {
    var calc,
        service;

    // the "factory" (AKA "service") to test
    function testService() {
        return {
            calc: calc
        };
        ///////////
        function calc(input, previousOutput){
            var inp =  +(input || 0);
            var prev = +(previousOutput || 0);
            return inp + prev;
        }
    }

    /**
     *  Register our test service anonymously with `anguler.mock.module`.
     *  N.B.: We don't need to mention any other modules
     *        because our test service doesn't depend on anything.
     */
    beforeEach(module(function($provide){
        $provide.factory('testService', testService);
    }));

    // The first `angular.mock.inject` closes module registration and modification
    beforeEach(inject(function(testService){
        service = testService;
        calc = service.calc; // DRY out the tests
    }));



    describe("(happy paths)", function () {

        it('calc() => 0', function () {
            expect(calc()).to.equal(0);
        });

        it('calc(1) => 1 ', function () {
            expect(calc(1)).to.equal(1);
        });

        it('calc(1,1) => 2', function () {
            expect(calc(1,1)).to.equal(2);
        });

        it('calc(-1) => -1', function () {
            expect(calc(-1)).to.equal(-1);
        });

        it('calc("0") => 0', function () {
            expect(calc('0')).to.equal(0);
        });

        it('calc("1") => 1', function () {
            expect(calc('1')).to.equal(1);
        });

        it('calc("-1") => -1', function () {
            expect(calc('-1')).to.equal(-1);
        });

        it('calc("") => 0', function () {
            expect(calc('')).to.equal(0);
        });

        it('calc(null) => 0', function () {
            expect(calc()).to.equal(0);
        });

        it('calc(undefined) => 0', function () {
            expect(calc(undefined)).to.equal(0);
        });
    });


    describe("(sad paths)", function () {

        it('calc("not a number") => NaN ', function () {
            expect(isNaN(calc('not a number'))).to.be.true;
        });

        it('calc(1, "not a number") => NaN ', function () {
            expect(isNaN(calc(1, 'not a number'))).to.be.true;
        });
    });

});
