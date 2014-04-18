/*
 *  Intro to spec'ing
 *  In general:   http://jasmine.github.io/2.0/introduction.html
 *  For matchers: https://github.com/pivotal/jasmine/wiki/Matchers
 *  prove that we can get specs running here
 */
xdescribe('intro to Jasmine', function () {
    'use strict';

    it('should pass an "always true" spec', function () {
        expect(true).toBe(true);
    });

    it('expect false to be false', function(){
        expect(false).toBe(false);
    });

    it('4 > 3', function () {
        expect(4).toBeGreaterThan(3);
    });

    it('can match with RegEx', function () {
        expect('My Dog Has Fleas').toMatch(/dog/i);
    });

    it("different objects with same structure and contents are not the same", function () {
        expect({"foo": "bar"}).not.toBe({"foo": "bar"});
    });

    it("different objects with same structure and contents are equal", function () {
        expect({"foo": "bar"}).toEqual({"foo": "bar"});
    });

    it('to be or not to be', function () {
        expect(false).not.toBe(true);
    });

    it('defined or not', function () {
        expect(undefined).not.toBeDefined();
    });

    it("can expect an exception", function(){
        expect(function () {
            throw new Error('uh oh!')
        }).toThrow();
    })

    it("can expect a specific exception", function(){
        expect(function () {
            throw new Error('oh boy!')
        }).toThrowError(/boy/);  // RegEx match the error message
    })

    it("can detect that a function was called", function () {
        var thing = {
            fn: function(){ throw new Error("won't actually be called")}
        };

        spyOn(thing, 'fn');

        thing.fn(); // will it throw?

        expect(thing.fn).toHaveBeenCalled();

        // much more to learn about spies

    });

    // nested describe
    describe("when you need setup/teardown", function () {

        beforeEach(function () {
            console.log('----- setup before the test -------')
        });
        afterEach(function () {
            console.log('----- cleanup after the test -------\n')
        });
        it("first spec", function () { console.log('first spec'); expect(true).toBe(true);});
        it("second spec", function () { console.log('second spec'); expect(true).toBe(true);});

    });

    // unit test: every dependency is a fake
    describe("unit test", function () {

        var foo = {
            go: function(number){return number;}
        };

        it("'foo.go(42)' returns 42", function () {
            expect(foo.go(42)).toBe(42);
        });


        var bar = function(foo){
            var val = Math.random(); // some complex calc
            return foo.go(val);
        };

        it("'bar() returns expected value, 42", function () {
            var fooFake = {
                go: function(){return 42;} // predictable value
            };
            expect(bar(fooFake)).toBe(42);
        });

    });

});
