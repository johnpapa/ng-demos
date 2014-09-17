describe('Basics - assertion examples:', function () {
    'use strict';

    describe('Array#indexOf()', function () {

        it('should return -1 when the value is not present', function () {
            expect([1, 2, 3].indexOf(5)).to.be.equal(-1);
        });
    });





    describe('when expecting exceptions', function () {
        it('passes only if there is an exception', function () {
            expect(function () {
                throw new Error('my bad');
            }).to.throw();
        });

        it('of a particular Error type', function () {
            // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError
            var err = new ReferenceError('This is a bad reference.');
            expect(function () {
                throw err;
            }).to.throw(ReferenceError);
        });

        it('with a particular message', function () {
            expect(function () {
                throw new Error('my bad');
            }).to.throw(/bad/);
        });


        it('of a particular Error type with a specific message', function () {
            var err = new ReferenceError('This is a bad reference.');
            expect(function () {
                throw err;
            }).to.throw(ReferenceError, /bad reference/);
        });
    });
});