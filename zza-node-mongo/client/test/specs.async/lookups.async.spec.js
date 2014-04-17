/************************
 * Test the lookups service asynchronously with specs that
 * HIT THE LIVE SERVER
 *
 * requires the ngMidwayTester
 *
 * These are almost the SAME TESTS AS IN SYNCHRONOUS lookups.spec.js !!!
 * but this time we're dealing with the full data set from the server
 * Still hitting the server before every test (see network traffic)
 * which makes these tests slow.
 *
 * That's why the sync test with $httpBackend mocked is preferred
 * and could disable/skip this test for most testing environments.
 */
describe("When testing lookups asynchronously", function () {

    var hasLoadFailed=false, lookups, tester;

    // Create this 'testApp' module once per file unless changing it
    testFns.create_testAppModule();

    var spec = testFns.create_fastFailSpec(function(){
        return hasLoadFailed ? 'load failed' : '';
    });

    // NOTICE this beforeEach is async (see the 'done' argument) !!!
    // The lookups service only goes async during the ready() call
    // after which it gets everything from cache.
    // Therefore, we "prime" it async in the beforeEach
    // and can test it synchronously thereafter.
    beforeEach(function (done) {
        if (hasLoadFailed){
            done();
        } else {
            tester = ngMidwayTester('testApp');
            lookups = tester.inject('lookups');
            // review network traffic to confirm it does hit the server before each test.
            lookups.ready(done, readyFailed);
        }

        function readyFailed(error){
            hasLoadFailed=true; // bail out of remaining tests
            var status = '\nResponse status: '+(error.status || 'none');
            var message = 'lookups.ready failed. Are the app and MongoDb servers running? '+
                status + ". Message: "+ (error.message || 'none');
            expect.toFail(message);
            done();
        }
    });

    afterEach(function () {
        if (tester){
            tester.destroy();
            tester = null;
        }
    });

    /* specs */

    it("doesn't bomb", spec(function () {
        expect(true).toBe(true);
    }));

    it("has OrderStatus", spec(function () {
        expect(lookups.OrderStatus).toBeDefined();
        expect(Object.keys(lookups.OrderStatus).length).toBeGreaterThan(1);
    }));

    it("has OrderStatus.Pending", spec(function () {
        expect(lookups.OrderStatus && lookups.OrderStatus.Pending).toBeDefined();
    }));

    it("has products", spec(function () {
        expect(lookups.products).toBeDefined();
        expect(lookups.products.length).toBeGreaterThan(1);
    }));

    it("has pizza products",spec(function () {
        expect(lookups.products).toBeDefined();
        var pizzas = lookups.products.byTag('pizza');
        expect(pizzas).toBeDefined();
        expect(pizzas.length).toBeGreaterThan(1);
    }));

    it("has no spices (because not in test data)", spec(function () {
        expect(lookups.products).toBeDefined();
        var pizzas = lookups.products.byTag('spice');
        expect(pizzas).toBeDefined();
        expect(pizzas.length).toEqual(0);
    }));

    it("has productOptions", spec(function () {
        expect(lookups.productOptions).toBeDefined();
        expect(lookups.productOptions.length).toBeGreaterThan(1);
    }));

    it("has productSizes",spec(function () {
        expect(lookups.productSizes).toBeDefined();
        expect(lookups.productSizes.length).toBeGreaterThan(1);
    }));

});