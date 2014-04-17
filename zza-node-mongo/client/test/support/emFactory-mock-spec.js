/************************
 * Test emFactory-mock
 * emFactory-mock is used only in testing
 *******************************/
describe("emFactory-mock:", function () {

    var $rootScope, breeze, emFactory;

    testFns.beforeEachApp('emFactoryMock');

    beforeEach(inject(function(_$rootScope_, _breeze_, entityManagerFactory) {
        $rootScope = _$rootScope_;
        breeze = _breeze_;
        emFactory = entityManagerFactory;
    }));

    describe("when call 'newManager'", function () {
        var manager;
        beforeEach(function () {
            manager = emFactory.newManager();
        });

        it("the manager has OrderStatus entities in cache", function () {
            var statuses = manager.getEntities('OrderStatus');
            expect(statuses.length).toBeGreaterThan(1);
        });

        it("a query targets the cache (rather than the server)", function () {
            breeze.EntityQuery.from('Products').using(manager).execute()
                .then(success).catch(testFns.failed);

            $rootScope.$digest(); // flush the async fn queue

            // If query were not actually synchronous
            // this method would not be called before the test ended.
            // Can check network traffic to confirm
            function success(data){
                var products = data.results;
                expect(products.length).toBeGreaterThan(1);
            }
        });

        // There is no 'Lookups' resource in cache so local cache query would normally bomb
        // but mock pretends 'Lookups' is an alias for some Lookup entity type
        it("a query for 'Lookups' doesn't bomb", function () {

            var success = jasmine.createSpy('success');

            breeze.EntityQuery.from('Lookups').using(manager).execute()
                .then(success).catch(testFns.failed);

            $rootScope.$digest(); // flush the async fn queue

            // Confirm that there are some - any - lookup entities.
            // N.B.: if query were not actually synchronous this test would fail.
            expect(manager.getEntities('Product').length).toBeGreaterThan(1);

            // The success callback should still be invoked
            expect(success).toHaveBeenCalled();
        });
    });

    describe("when call 'getManager'", function () {
        var manager; // the 'master manager'
        beforeEach(function () {
            manager = emFactory.getManager();
        });
        it("returns a manager populated with lookups", function () {
            // Confirm that there are some - any - lookup entities.
            expect(manager.getEntities('Product').length).toBeGreaterThan(1);
        });

        it("the result is not the same as the result of 'newManager()'", function () {
            var newManager = emFactory.newManager();
            expect(newManager).not.toBe(manager);
        });

        it("always returns the same 'master manager'", function () {
            var em2 = emFactory.getManager();
            expect(em2).toBe(manager);
        });
    });

});
