describe("Basics - factory:", function () {
    /*
     * Registers a new test module with global angular, 'app.test'
     * In Basics, 'app.test' is a stand-in for a production app module.
     * Unlike your production module (e.g., 'app')
     * the 'app.test' module is redefined with each new individual test run
     * Same substance as 'factory-alternative.spec' ... different setup style
     * You'll likely prefer this style.
     * 
     * DO NOT move 'app.test' module definition outside of a `beforeEach`
     * because 'app.test' redefinition elsewhere will wipe it out, 
     * breaking other tests unpredictably     
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


    /*** Setup module registry ***/

    beforeEach(function () {
        angular
            .module('app.test', [])
            .factory('testService', testService);

        module('app.test');
    });



    /*** Start using the module registry ***/
    // The first `angular.mock.inject` closes module registration and modification

    // Get the service
    beforeEach(inject(function(testService){
        service = testService;
    }));



    /*** Let's test! ***/

    describe("(happy paths)", function () {

        it('calc() => 0', function () {
            expect(service.calc()).to.equal(0);
        });

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
