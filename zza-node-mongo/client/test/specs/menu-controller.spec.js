/************************
 * Test the menu controller defined in menu.js
 *
 * To Test:
 * - each valid product type can return a products array
 * - invalid product type returns 'pizza' products
 * - can generate the right link for a product
 * - calling vm.go goes to the right view for the product
 *******************************/
describe("Menu Controller: ", function () {

    var controller,
        controllerFactory,
        controllerName='menu',
        dataservice,
        expectedProducts,
        $state;

    testFns.beforeEachApp( function($provide){
        dataservice = new DataServiceMock();
        $provide.value('dataservice', dataservice);
    });

    beforeEach(inject(function($controller, _$state_) {
        controllerFactory = $controller;
        $state = _$state_;
    }));

    describeStateParamSpec('drink');
    describeStateParamSpec('pizza');
    describeStateParamSpec('salad');

    describe("given non-existent product type, 'foo', treated as 'pizza' ",  function(){
        beforeEach(function () {
            createControllerForProductType('foo');
        });
        runStateParamSpecs('pizza');
    });

    describe("given no product type, treated as 'pizza' ",  function(){
        beforeEach(function () {
            createControllerForProductType(undefined);
        });
        runStateParamSpecs('pizza');
    });

    describe("when select a pizza product", function () {
        var product = new ProductMock('pizza', 42);
        beforeEach(function () {
            createControllerForProductType('pizza');
        });

        it("creates correct link for the product", function () {
            var ref = controller.productRef(product);
            expect(ref).toBe('#/menu/pizza/42')
        });

        it("calling 'go' goes to the right location for the product", function () {
            // not very testable because we have to know all of the view templates,
            // top to bottom, for the target state
            // so we can fake them in $templateCache
            inject( function($location, $rootScope, $templateCache){
                // fakes of the views that would be loaded to get to this state
                $templateCache.put('app/shell/header.html','');
                $templateCache.put('app/shell/footer.html','');
                $templateCache.put('app/shell/home.html','');
                $templateCache.put('app/order/order.html','');
                $templateCache.put('app/order/orderSidebar.html','');
                $templateCache.put('app/order/orderItem.html','');

                controller.go(product);
                $rootScope.$digest(); // flush the route change

                expect($location.$$path).toBe('/menu/pizza/42')
            });
        });

    });

    /* spec helpers */
    function describeStateParamSpec(productType){

        describe("given $stateParams for the '"+productType+"' product type",  function(){
            beforeEach(function () {
                createControllerForProductType(productType);
            });
            runStateParamSpecs(productType);
        });
    }

    function createControllerForProductType(productType){
        var  ctorArgs ={
            "$stateParams": {productType: productType },
            "dataservice" :  dataservice
        };
        expectedProducts = [new ProductMock(productType)];
        dataservice.lookups.products.byTag.and.returnValue(expectedProducts);

        controller = controllerFactory(controllerName, ctorArgs);
    }

    function runStateParamSpecs(productType){
        it("exposes products of the '"+productType+"' product type", function(){
            var products = controller.products;
            expect(products).toEqual(expectedProducts);
        });

        it("exposes the '"+productType+"' view template", function(){
            var template = controller.template;
            var re = new RegExp(productType + ".html");
            expect(template).toMatch(re);
        });
    }

    function DataServiceMock(){
        // dataservice.lookups.products.byTag
        this.lookups = {
                products:{
                    byTag: jasmine.createSpy('byTag')
                }
            };
        this.ready =  function (success){ return (success) ? success() : undefined;}
    }

    function ProductMock(type, id){
        this.type = type;
        this.id = id || 42;
    }
});