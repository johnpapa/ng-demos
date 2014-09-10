describe("ccSidebar directive", function () {

    var dropClass = 'dropy',
        dropdownElement,
        el,
        innerElement,
        scope;

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

    it("a closed menu lacks dropClass", function () {
        expect(dropdownElement.hasClass(dropClass)).to.be.false;
    });

    it("clicking menu when closed should add dropClass", function () {
        dropdownElement.trigger('click'); //click it
        expect(dropdownElement.hasClass(dropClass)).to.be.true;
    });

    it("an open menu has dropClass", function () {
        setupAsOpen();
        expect(dropdownElement.hasClass(dropClass)).to.be.true;
    });

    it("clicking menu when open should remove dropClass", function () {
        setupAsOpen();
        dropdownElement.trigger('click'); //click it
        expect(dropdownElement.hasClass(dropClass)).to.be.false;
    });

    describe("when animating", function () {
        beforeEach(function () {
            // remember current state of jQuery's global FX duration switch
            this.oldFxOff = $.fx.off;
            // zero animation time; no waiting for animation to complete
            $.fx.off = true;
            // must add to DOM when testing jQuery animation result
            el.appendTo(document.body);
        });

        afterEach(function () {
            $.fx.off = this.oldFxOff;
            el.remove();
        });

        it("inner is visible after opening menu", function () {
            // should NOT be visible when we start
            expect(innerElement.css('display')).to.equal('none');
            dropdownElement.trigger('click'); //click it
            expect(innerElement.css('display')).to.equal('block');
        });

        it("inner is not visible after closing menu", function () {
            setupAsOpen();

            // should be visible when we start
            expect(innerElement.css('display')).to.equal('block');
            dropdownElement.trigger('click'); //click it
            expect(innerElement.css('display')).to.equal('none');
        });
    });

    function setupAsOpen(){
        dropdownElement.addClass(dropClass);
        innerElement.css('display','block');
    }
});
