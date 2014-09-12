/* global describe, it, beforeEach, afterEach, expect, inject, sinon, specHelper */
/* global $controller, $httpBackend, $location, $q, $rootScope, $route */
/* jshint expr: true, multistr: true */
describe('ccSidebar directive', function () {
    var dropClass = 'dropy';
    var dropdownElement;
    var el;
    var innerElement;
    var scope;

    beforeEach(module('app.widgets'));

    beforeEach(inject(function($compile, $rootScope){
        scope = $rootScope;
        // The minimum necessary template
        el = angular.element(
                '<div cc-sidebar > \
                    <div class="sidebar-dropdown"><a href="">Menu</a></div> \
                    <div class="sidebar-inner" style="display: none"></div> \
                </div>');
        $compile(el)(scope);
        scope.$digest();

        dropdownElement = el.find('.sidebar-dropdown a');
        innerElement = el.find('.sidebar-inner');
    }));

    // helper to setup the element in the 'menu open' state
    function setupAsOpen(){
        dropdownElement.addClass(dropClass);
        innerElement.css('display','block');
    }

    it('a closed menu lacks dropClass', function () {
        expect(dropdownElement.hasClass(dropClass)).to.be.false;
    });

    it('clicking menu when closed should add dropClass', function () {
        dropdownElement.trigger('click'); //click it
        expect(dropdownElement.hasClass(dropClass)).to.be.true;
    });

    it('an open menu has dropClass', function () {
        setupAsOpen();
        expect(dropdownElement.hasClass(dropClass)).to.be.true;
    });

    it('clicking menu when open should remove dropClass', function () {
        setupAsOpen();
        dropdownElement.trigger('click'); //click it
        expect(dropdownElement.hasClass(dropClass)).to.be.false;
    });

    describe('when animating w/ jQuery fx off', function () {
        beforeEach(function () {
            // remember current state of jQuery's global FX duration switch
            this.oldFxOff = $.fx.off;
            // when jQuery fx are of, there is zero animation time; no waiting for animation to complete
            $.fx.off = true;
            // must add to DOM when testing jQuery animation result
            el.appendTo(document.body);
        });

        afterEach(function () {
            $.fx.off = this.oldFxOff;
            el.remove();
        });

        it('inner is visible after opening menu', function () {
            // should be hidden when we start
            expect(innerElement.css('display')).to.equal('none');
            dropdownElement.trigger('click'); //click it
            // should be visible after animation
            expect(innerElement.css('display')).to.equal('block');
        });

        it('inner is not visible after closing menu', function () {
            setupAsOpen();

            // should be visible when we start
            expect(innerElement.css('display')).to.equal('block');
            dropdownElement.trigger('click'); //click it
            // should be hidden after animation
            expect(innerElement.css('display')).to.equal('none');
        });
    });

    //////////  uncomment only during demonstration ///////
    // What if you don't know about turning JQuery animation durations off ($.fx.off?
    // You have to write async tests
    /*
    describe('when animating  w/ jQuery fx turned on', function () {
        beforeEach(function () {
            // must add to DOM when testing jQuery animation result
            el.appendTo(document.body);
        });

        afterEach(function () {
            el.remove();
        });

        it('inner is visible after opening menu - async', function (done) {
            // should be hidden when we start
            expect(innerElement.css('display')).to.equal('none');
            dropdownElement.trigger('click'); //click it

            setTimeout(function () {
                try{
                    console.log('async after open animate');
                    // should be visible after animation
                    expect(innerElement.css('display')).to.equal('block');
                    done();
                } catch(e){
                    done(e);
                }
            }, 400); // guess at animation time + a little more
        });

        it('inner is not visible after closing menu - async', function (done) {
            $.fx.off = true;
            setupAsOpen();

            // should be visible when we start
            expect(innerElement.css('display')).to.equal('block');
            dropdownElement.trigger('click'); //click it

            setTimeout(function () {
                try{
                    console.log('async after close animate');
                    // should be hidden after animation
                    expect(innerElement.css('display')).to.equal('none');
                    done();
                } catch(e){
                    done(e);
                }
            }, 400); // guess at animation time + a little more
        });
    });
    */
});
