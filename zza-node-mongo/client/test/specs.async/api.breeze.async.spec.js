/************************
 * Test the Zza web api of the LIVE SERVER with asynchronous specs using BreezeJS
 * requires the ngMidwayTester
 *******************************/
describe('When querying Zza web api with BreezeJS', function () {
    var breeze, em, tester;
    var testFns = window.testFns,
        failed = testFns.failed;

    // Create this 'testApp' module once per file unless changing it
    testFns.create_testAppModule();

    beforeEach(function () {
        // create a new tester before each test
        tester = ngMidwayTester('testApp');

        breeze = tester.inject('breeze');
        em = testFns.create_appEntityManager(tester.inject);
    });

    afterEach(function () {
        // destroy the tester after each test
        tester.destroy();
        tester = null;
    });

    it('can fetch all OrderStatus entities', function (done) {
        breeze.EntityQuery.from('OrderStatuses')
            .using(em).execute()
            .then(success)
            .catch(failed)
            .finally(done);

        function success(data) {
            var orderStatuses = data.results;
            expect(orderStatuses).toBeDefined();
            expect(orderStatuses.length).toBeGreaterThan(0);
            console.log("OrderStatuses query returned " + orderStatuses.length);
        }
    });

    it('can fetch Lookups', function (done) {
        breeze.EntityQuery.from('Lookups')
            .using(em).execute()
            .then(success).catch(failed).finally(done);

        function success(data) {
            // Usually a bad idea to have a lot of expectations in a single spec
            // but we'd like to minimize trips to the server.

            var results = data.results[0];
            expect(results).toBeDefined();
            console.log("Lookups query returned an object with " +
                Object.keys(results).length + " properties");

            var orderStatuses = results.OrderStatus;
            expect(orderStatuses.length).toBeGreaterThan(0);
            console.log("    orderStatuses: " + orderStatuses.length);

            var products = results.Product;
            expect(products.length).toBeGreaterThan(0);
            console.log("    products: " + products.length);

            var productOptions = results.ProductOption;
            expect(productOptions.length).toBeGreaterThan(0);
            console.log("    productOptions: " + productOptions.length);

            var productSizes = results.ProductSize;
            expect(productSizes.length).toBeGreaterThan(0);
            console.log("    productSizes: " + productSizes.length);
        }
    });

    it('can fetch some Product entities', function (done) {
        breeze.EntityQuery.from('Products')
            .take(3)              // no more than 3
            .using(em).execute()
            .then(success).catch(failed).finally(done);

        function success(data) {
            var products = data.results;
            expect(products).toBeDefined();
            expect(products.length).toBeGreaterThan(0);
            expect(products.length).toBeLessThan(4);
            console.log("Product 'take(3)' query returned " + products.length);
        }
    });

    it('can fetch a Customer named "Derek"', function (done) {
        //http://localhost:3000/breeze/zza/Customers/?$filter=firstName eq  'Derek'
        breeze.EntityQuery.from('Customers')
            .where('firstName', 'eq', 'Derek')
            .using(em).execute()
            .then(success).catch(failed).finally(done);

        function success(data) {
            var derek = data.results[0];
            expect(derek).toBeDefined();
            expect(derek.fullName).toMatch(/derek/i);
            console.log("The first 'Derek' Customer's full name is " + derek.fullName);
        }
    });

    it("can fetch the 'order headers' projection of 'Alexa Butler' orders", function (done) {
        // Customer 'Alex Butler' has customerId = '51f06ded06a7baa417000058'
        //
        // THIS IS A BRITTLE TEST BECAUSE THE DATA COULD EASILY CHANGE
        // breaking the test while revealing nothing about the api or our code
        //
        //http://localhost:3000/breeze/zza/Orders?$filter=
        // customerId eq '51f06ded06a7baa417000058'
        // &$orderby=ordered desc&
        // $select=_id,statusId,status,ordered,delivered,deliveryCharge,itemsTotal
        breeze.EntityQuery.from('Orders')
            .where('customerId', 'eq', '51f06ded06a7baa417000058')
            .select('id,name,statusId,status,ordered,delivered,deliveryCharge,itemsTotal')
            .using(em).execute()
            .then(success).catch(failed).finally(done);

        function success(data) {
            var orderHeaders = data.results;
            expect(orderHeaders).toBeDefined();
            expect(orderHeaders[0].name).toEqual('Alexa Butler');
            expect(orderHeaders.length).toBeGreaterThan(0);
            console.log("projected 'Alex Butler' orders into 'order headers': " + orderHeaders.length);
        }
    });

});