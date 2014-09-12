describe("Basics - factory (alternate):", function () {
    /*
     * Registers the imaginary app components directly with the angular mock module registry
     *
     * Reveals the magic behind module registration.
     * Same substance as 'factory.spec' ... different setup style
     */
    var service;

    /*** Define service in our imaginary application  ***/

    // "factory" (AKA "service") to test
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


    /*** Testing begins ***/

    // Register our test service anonymously with `angular.mock.module`.
    // We don't need a module!!!
    beforeEach(module(function($provide){
        // just like `angular.module('app.factory.test').factory('testService', testService)
        $provide.factory('testService', testService);
    }));


    /*** Start using the module registry ***/
    // The first `angular.mock.inject` closes module registration and modification

    // Get the service
    beforeEach(inject(function(testService){
        service = testService;
    }));



    /*** Let's test! ***/

    describe("(happy path)", function () {

        it('calc() => 0', function () {
            expect(service.calc()).to.equal(0);
        });
    });


    describe("(more happy paths)", function () {
        it('calc(1) => 1 ', function () {
            expect(service.calc(1)).to.equal(1);
        });

        it('calc(1,1) => 2', function () {
            expect(service.calc(1,1)).to.equal(2);
        });

        it('calc(-1) => -1', function () {
            expect(service.calc(-1)).to.equal(-1);
        });

        it('calc("0") => 0', function () {
            expect(service.calc('0')).to.equal(0);
        });

        it('calc("1") => 1', function () {
            expect(service.calc('1')).to.equal(1);
        });

        it('calc("-1") => -1', function () {
            expect(service.calc('-1')).to.equal(-1);
        });

        it('calc("") => 0', function () {
            expect(service.calc('')).to.equal(0);
        });

        it('calc(null) => 0', function () {
            expect(service.calc()).to.equal(0);
        });

        it('calc(undefined) => 0', function () {
            expect(service.calc(undefined)).to.equal(0);
        });
    });


    describe("(sad paths)", function () {

        it('calc("not a number") => NaN ', function () {
            expect(isNaN(service.calc('not a number'))).to.be.true;
        });

        it('calc(1, "not a number") => NaN ', function () {
            expect(isNaN(service.calc(1, 'not a number'))).to.be.true;
        });
    });

});
