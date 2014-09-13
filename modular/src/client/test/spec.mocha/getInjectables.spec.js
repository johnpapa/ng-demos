describe.only('specHelper.getInjectables', function () {
    'use strict';

    beforeEach(module('basics'));

    beforeEach(function(){
        // Confirm no window pollution from a prior getInjectables() call
        expect(window.$log).to.not.exist;
        expect(window.calcService).to.not.exist;
        expect(window.baz).to.not.exist;
        expect(window.foo).to.not.exist;
    });

    describe('(describe #1):', function () {

        it('window.$log and window.calcService should not exist', function() {
            expect(window.$log).to.not.exist;
            expect(window.calcService).to.not.exist;
        });

    });

    describe('(describe #2):', function () {

    	beforeEach(function(){
            // window.$log and window.calcService should not exist before any test
		    expect(window.$log).to.not.exist;
	        expect(window.calcService).to.not.exist;
		});

        // Although getInjectables() puts injectables in the window,
        // it also removes them after each test by scheduling an afterEach
        // Notice ... no private vars for $log or calcService! ... no injecting of them either.
        it('should set window.$log and window.calcService when call getInjectables with a func', function () {

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

        it('should set window.$log and window.calcService when call getInjectables with string array', function () {

            specHelper.getInjectables(['$log', 'calcService']);

            expect($log).to.exist;
            expect(calcService).to.exist;
        });

        it('should set window.$log and window.calcService when call getInjectables with string params', function () {

            specHelper.getInjectables('$log', 'calcService');

            expect($log).to.exist;
            expect(calcService).to.exist;
        });

        it('should set window.$log and window.foo when call getInjectables("$log","block.foo")', function () {

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
         
        /*
        // Would fail because THIS afterEach is registered BEFORE the one created by specHelper.getInjectables      
        afterEach(function(){
            // Should have cleaned up after itself
            expect(window.$log).to.not.exist;
            expect(window.calcService).to.not.exist;
        });

        */
    });

    describe('(describe #3):', function () {

        it('window.$log and window.calcService should not exist', function(){
            expect(window.$log).to.not.exist;
            expect(window.calcService).to.not.exist;
        });
    });

    describe('(describe #4):', function () {

        beforeEach(function(){

            // register this ridiculous value for just this describe
            module(function($provide){
                $provide.value('baz', 'baz');
            })
            
            specHelper.getInjectables('baz'); // get baz in outer describe
        });


        describe('in nested describe', function(){

            it('baz is available from parent describe', function(){
                expect(baz).to.exist;
            }); 

            it('baz from getInjectables() is same object as baz from direct injection', function () {

                specHelper.getInjectables('baz');

                inject(function(_baz_){
                    expect(baz).to.equal(_baz_);
                });
            });           
        })
    });

});