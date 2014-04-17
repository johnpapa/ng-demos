/************************
 * orderItem controller
 *
 * Tested with "deep integration".
 * Relies on the real dataservice and real models
 *
 * Stays synchronous because using the EntityManagerFactory mock
 * to prime the EntityManager cache with test data AND
 * set the default FetchStrategy to 'FromLocalCache'
 * so no (normal) queries can go to the server.
 *
 * TODO: spec the "pass in orderItem.id" scenarios
 *************************/
describe("orderItem controller: ", function () {

    var controller,
        controllerFactory,
        controllerName='orderItem',
        dataservice,
        flush$q,
        orderItemOptionTypeVm,
        $q,
        $state;

    // emFactoryMock: primes a disconnected EntityManager with test lookup entities
    testFns.beforeEachApp('emFactoryMock');

    beforeEach(inject(function($controller, _$q_) {
        controllerFactory = $controller;
        $q = _$q_;

        flush$q = testFns.create_flush$q();

        $state = {
            go: jasmine.createSpy('go')
        };

        orderItemOptionTypeVm = {
            createVms: jasmine.createSpy('createVms')
                        .and.callFake(function(){return [];})
        };
    }));

    describe("When create controller and make it ready and pass no $stateParams", function () {
        beforeEach(function () {
            var ctorArgs = {
                $state: $state,
                orderItemOptionTypeVm: orderItemOptionTypeVm
            };
            controller = controllerFactory(controllerName, ctorArgs);
            flush$q();
        });

        it("does not bomb", function () {});

        it("does NOT try to get orderItem ViewModels", function () {
            expect(orderItemOptionTypeVm.createVms).not.toHaveBeenCalled();
        });

        it("does try to go back to the menu state", function () {
            expect($state.go).toHaveBeenCalled();
            // first arg of first call === 'app.menu' state name
            expect($state.go.calls.argsFor(0)[0]).toEqual('app.menu');
        });
    });

    describe("when create a readied controller with productId $stateParams", function () {
        beforeEach(inject(function (_dataservice_) {
            dataservice = _dataservice_;

            var ctorArgs = {
                $state: $state,
                $stateParams: {productId: 1}, // "Plain Cheese" pizza
                orderItemOptionTypeVm: orderItemOptionTypeVm
            };
            controller = controllerFactory(controllerName, ctorArgs);
            flush$q();
        }));

        it("does not bomb", function () {});

        it("does NOT try to go back to the menu state", function () {
            expect($state.go).not.toHaveBeenCalled();
        });

        it("does try to get orderItem ViewModels", function () {
            expect(orderItemOptionTypeVm.createVms).toHaveBeenCalled();
        });

        it("the dataservice is ready with lookups that work", function(){
            var lookups = dataservice.lookups;
            expect(lookups).toBeDefined();
            var product = lookups.products.byId(1);
            expect(product).toBeDefined();
        });

        it("the orderItem product is the expected product", function () {
            var product = dataservice.lookups.products.byId(1);
            expect(controller.orderItem.product).toBe(product);
        });

        it("the controller.product is the expected product", function () {
            var product = dataservice.lookups.products.byId(1);
            expect(controller.product).toBe(product);
        });

        it("the orderItem is in the draft order", function () {
            expect(controller.isDraftOrder).toBe(true);
        });

        it("'addToCart' moves the orderItem to the cart", function () {
            controller.addToCart();
            expect(controller.isDraftOrder).toBe(false);
            var orderItem = controller.orderItem;
            var firstCartOrder = dataservice.cartOrder.orderItems[0];
            expect(firstCartOrder).toBe(orderItem);
        });

        it("'addToCart' tries to go back to the menu", function(){
            expect($state.go).not.toHaveBeenCalled();
            controller.addToCart();
            // first arg of first call === 'app.menu' state name
            expect($state.go.calls.argsFor(0)[0]).toEqual('app.menu');
        });

    });

});