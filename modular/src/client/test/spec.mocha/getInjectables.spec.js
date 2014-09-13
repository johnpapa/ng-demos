describe('specHelper.getInjectables:', function () {
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

        // Although getInjectables() puts injectables in the window,
        // it also removes them after each test by scheduling an afterEach
        // Notice ... no private vars for $log or calcService! ... no injecting of them either.
        it('#2a should set window.$log and window.calcService when call getInjectables with a func', function () {

	        specHelper.getInjectables(function($log, calcService){});

            expect($log).to.exist;
            expect(calcService).to.exist;

            // They are actually in the window
	        expect(window.$log).to.exist;
	        expect(window.calcService).to.exist;

            // THIS afterEach is registered AFTER the one created by specHelper.getInjectables
            afterEach(function(){
                // Should have cleaned up after itself
                expect(window.$log).to.not.exist;
                expect(window.calcService).to.not.exist;
            });

        });


        it('#2b should set window.$log and window.calcService when call getInjectables with string array', function () {

            specHelper.getInjectables(['$log', 'calcService']);

            expect($log).to.exist;
            expect(calcService).to.exist;
        });

        it('#2c should set window.$log and window.calcService when call getInjectables with string params', function () {

            specHelper.getInjectables('$log', 'calcService');

            expect($log).to.exist;
            expect(calcService).to.exist;
        });

        it('#2d should set window.$log and window.foo when call getInjectables("$log","block.foo")', function () {

            // register this ridiculous value for just this test
            module(function($provide){
                $provide.value('block.foo', 'foo');
            })

            // Can inject a service with a dotted name!
            specHelper.getInjectables('$log', 'block.foo');

            expect($log).to.exist;
            expect(foo).to.exist;
            expect(window.foo).to.exist;


            afterEach(function(){
                // Should have cleaned up after itself
                expect(window.$log).to.not.exist;
                expect(window.foo).to.not.exist;
            });
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