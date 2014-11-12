/* jshint -W117, -W030 */
describe('ccSidebar directive: ', function () {
    var dropdownElement;
    var el;
    var innerElement;
    var isOpenClass = 'dropy';
    var scope;

    beforeEach(module('app.widgets'));

    beforeEach(inject(function($compile, $rootScope) {
        // The minimum necessary template HTML for this spec.
        // Simulates a menu link that opens and closes a dropdown of menu items
        // The `when-done-animating` attribute is optional (as is the vm's implementation)
        //
        // N.B.: the attribute value is supposed to be an expression that invokes a $scope method
        //       so make sure the expression includes '()', e.g., "vm.sidebarReady(42)"
        //       no harm if the expression fails ... but then scope.sidebarReady will be undefined.
        //       All parameters in the expression are passed to vm.sidebarReady ... if it exists
        //
        // N.B.: We do NOT add this element to the browser DOM (although we could).
        //       spec runs faster if we don't touch the DOM (even the PhantomJS DOM).
        el = angular.element(
            '<div cc-sidebar  when-done-animating="vm.sidebarReady(42)" >' +
            '<div class="sidebar-dropdown"><a href="">Menu</a></div>' +
            '<div class="sidebar-inner" style="display: none"></div>' +
            '</div>');

        // The spec examines changes to these template parts
        dropdownElement = el.find('.sidebar-dropdown a'); // the link to click
        innerElement    = el.find('.sidebar-inner');      // container of menu items

        // ng's $compile service resolves nested directives (there are none in this example)
        // and binds the element to the scope (which must be a real ng scope)
        scope = $rootScope;
        $compile(el)(scope);

        // tell angular to look at the scope values right now
        scope.$digest();
    }));

    /// tests ///
    describe('the isOpenClass', function () {
        it('is absent for a closed menu', function () {
            hasIsOpenClass(false);
        });

        it('is added to a closed menu after clicking', function () {
            clickIt();
            hasIsOpenClass(true);
        });

        it('is present for an open menu', function () {
            openDropdown();
            hasIsOpenClass(true);
        });

        it('is removed from a closed menu after clicking', function () {
            openDropdown();
            clickIt();
            hasIsOpenClass(false);
        });
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

        it('dropdown is visible after opening a closed menu', function () {
            dropdownIsVisible(false); // hidden before click
            clickIt();
            dropdownIsVisible(true); // visible after click
        });

        it('dropdown is hidden after closing an open menu', function () {
            openDropdown();
            dropdownIsVisible(true); // visible before click
            clickIt();
            dropdownIsVisible(false); // hidden after click
        });

        it('click triggers "when-done-animating" expression', function () {

            // spy on directive's callback when the animation is done
            var spy = sinon.spy();

            // Recall the pertinent tag in the template ...
            // '    <div cc-sidebar  when-done-animating="vm.sidebarReady(42)" >
            // therefore, the directive looks for scope.vm.sidebarReady
            // and should call that method with the value '42'
            scope.vm = {sidebarReady: spy};

            // tell angular to look again for that vm.sidebarReady property
            scope.$digest();

            // spy not called until after click which triggers the animation
            expect(spy).not.to.have.been.called;

            // this click triggers an animation
            clickIt();

            // verify that the vm's method (sidebarReady) was called with '42'
            // FYI: spy.args[0] is the array of args passed to sidebarReady()
            expect(spy).to.have.been.calledWith(42);
        });
    });

    /////// helpers //////

    // put the dropdown in the 'menu open' state
    function openDropdown() {
        dropdownElement.addClass(isOpenClass);
        innerElement.css('display', 'block');
    }

    // click the "menu" link
    function clickIt() {
        dropdownElement.trigger('click');
    }

    // assert whether the "menu" link has the class that means 'is open'
    function hasIsOpenClass(isTrue) {
        var hasClass = dropdownElement.hasClass(isOpenClass);
        expect(hasClass).equal(!!isTrue,
            'dropdown has the "is open" class is ' + hasClass);
    }

    // assert whether the dropdown container is 'block' (visible) or 'none' (hidden)
    function dropdownIsVisible(isTrue) {
        var display = innerElement.css('display');
        expect(display).to.equal(isTrue ? 'block' : 'none',
            'innerElement display value is ' + display);
    }

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

        it('dropdown is visible after opening menu - async', function (done) {

            dropdownIsVisible(false); // should be hidden when we start
            clickIt();

            setTimeout(function () {
                try{
                    console.log('async after open animate');
                    // should be visible after animation
                    dropdownIsVisible(true);
                    done();
                } catch(e){
                    done(e);
                }
            }, 400); // guess at animation time + a little more
        });

        it('dropdown is hidden after closing menu - async', function (done) {
            $.fx.off = true;
            openDropdown();

            dropdownIsVisible(true); // should be visible when we start
            clickIt();

            setTimeout(function () {
                try{
                    console.log('async after close animate');
                    // should be hidden after animation
                    dropdownIsVisible(false);
                    done();
                } catch(e){
                    done(e);
                }
            }, 400); // guess at animation time; then add a little more
        });
    });
    */
});
