describe.only('Basics - getInjectables:', function () {
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

        it('#2 should set window.$log and window.calcService when call getInjectables', function () {
			var fn = function($log, calcService){}
	        specHelper.getInjectables(fn);
	        //eval(specHelper.getInjectables(fn));

	        expect(window.$log).to.exist;
	        expect(window.calcService).to.exist;

            // THIS afterEach is registered AFTER the one created by specHelper.getInjectables
            afterEach(function(){
                // Should have cleaned up after itself
                expect(window.$log).to.not.exist;
                expect(window.calcService).to.not.exist;
            });

        });

        it('#3 window.$log and window.calcService should not exist', function() {
            expect(window.$log).to.not.exist;
            expect(window.calcService).to.not.exist;
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