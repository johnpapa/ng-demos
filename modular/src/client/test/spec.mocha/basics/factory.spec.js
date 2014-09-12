describe("Basics - factory:", function () {
    'use strict';

    var calc;

    beforeEach(module('basics'));

    // Get the service
    // This first `angular.mock.inject` closes module registration and modification
    beforeEach(
        inject(function(calcService) {
            calc = calcService.calc;
        })
    );

    /*** Multiple test paths ***/

    describe("(happy path test)", function () {

        it('calc() => 0', function () {
            expect(calc()).to.equal(0);
        });


        it('$log is an ngMock and can tell us about logged messages',
            inject(function ($log) {
                calc(1);

                // assert calc logged the result
                expect($log.debug.logs.length).to.equal(1,
                    "Should have called $log.debug exactly once");

                // with the expected message
                expect($log.debug.logs[0][0]).to.equal('calc(1, undefined) => 1');
            })
        );

    });

    describe("(more happy path tests)", function () {
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
