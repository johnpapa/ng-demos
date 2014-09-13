describe('Basics - getInjectables:', function () {
    'use strict';

    describe('in the starting test path', function () {
        it('#1 window.$log and window.calcService should not exist', function() {
            expect(window.$log).to.not.exist;
            expect(window.calcService).to.not.exist;
        });
    });

    describe('in the middle test path', function () {

    	beforeEach(module('basics'));

    	beforeEach(function(){
            //window.$log and window.calcService should not exist
		    expect(window.$log).to.not.exist;
	        expect(window.calcService).to.not.exist;
		});

        it('#2a should set window.$log and window.calcService when call getInjectables with func', function () {
			var fn = function($log, calcService){}

	        specHelper.getInjectables(fn);

	        expect(window.$log).to.exist;
	        expect(window.calcService).to.exist;

            // THIS afterEach is registered AFTER the one created by specHelper.getInjectables
            afterEach(function(){
                // Should have cleaned up after itself
                expect(window.$log).to.not.exist;
                expect(window.calcService).to.not.exist;
            });

        });


        it('#2b should set window.$log and window.calcService when call getInjectables with [strings]', function () {

            specHelper.getInjectables(['$log', 'calcService']);

            expect(window.$log).to.exist;
            expect(window.calcService).to.exist;
        });

        it('#2c should set window.$log and window.calcService when call getInjectables with string params', function () {

            specHelper.getInjectables('$log', 'calcService');

            expect(window.$log).to.exist;
            expect(window.calcService).to.exist;
        });

/*      Would fail because THIS afterEach is registered BEFORE the one created by specHelper.getInjectables

        afterEach(function(){
            // Should have cleaned up after itself
            expect(window.$log).to.not.exist;
            expect(window.calcService).to.not.exist;
        });
 */
    });

    describe('in the ending test path', function () {
        it('#4 window.$log and window.calcService should not exist', function(){
            expect(window.$log).to.not.exist;
            expect(window.calcService).to.not.exist;
        });
    });
});