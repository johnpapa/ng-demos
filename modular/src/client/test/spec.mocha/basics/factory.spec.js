describe("Basics - factory:", function () {

    /*** Create the module that we'll test in this Basics spec ***/
    angular
        .module('app.factory.test', [])
        .factory('testService', testService);

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
    var service;

    beforeEach(module('app.factory.test'));

    // Get the service
    // This first `angular.mock.inject` closes module registration and modification
    beforeEach(inject(function(testService){
        service = testService;
    }));


    /*** Let's test! ***/

    describe("(happy path test)", function () {

        it('calc() => 0', function () {
            expect(service.calc()).to.equal(0);
        });
    });

    describe("(more happy path tests)", function () {
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
