/************************
 * Test lookups service by mocking the HTTP traffic
 *******************************/
describe("lookups service with faked http response:", function () {

    var $httpBackend, $log, flush$q, lookups;
    var failed = testFns.failed;

    var lookupsUrl = 'breeze/zza/Lookups?';      // Url of the lookups endpoint
    var lookupsUrlRe = /breeze\/zza\/Lookups\?/; // RegEx of the lookups endpoint

    var validLookupsResponse = testFns.lookupsHttpResponse;

    testFns.beforeEachApp(); // not faking out the EntityManagerFactory!

    beforeEach(inject(function(_$httpBackend_, _$log_, $rootScope, _lookups_) {
        $httpBackend = _$httpBackend_;
        $log = _$log_;
        flush$q = function() { $rootScope.$apply(); };
        lookups = _lookups_;
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("when probing the spec machinery", function () {
        it("spec starts", function () {
            expect(true).toBe(true);
        });

        it("$httpBackend works when calling $httpGET with dummy response", function () {
            var $http = this.$injector.get('$http');
            $httpBackend.expectGET(lookupsUrlRe).respond({foo: "bar"});

            $http.get(lookupsUrl)
                .success(function(data){ expect(data).toBeDefined();})
                .catch(failed);

            $httpBackend.flush();
        });

        it("$httpBackend works when calling $httpGET with valid Lookups Response", function () {
            var $http = this.$injector.get('$http');
            $httpBackend.expectGET(lookupsUrlRe).respond(validLookupsResponse.data);

            $http.get(lookupsUrl)
                .success(function(data){
                    expect(data).toBeDefined();
                    expect(data).not.toEqual({foo: "bar"});
                    expect(data).toEqual(validLookupsResponse.data);
                })
                .catch(failed);

            $httpBackend.flush();
        });
    });

    describe("when service receives valid lookups data", function () {
        beforeEach(function () {
            $httpBackend.expectGET(lookupsUrlRe).respond(validLookupsResponse.data);
            lookups.ready();
            $httpBackend.flush();
        });
        it("doesn't bomb", function () {
            expect(true).toBe(true);
        });
        it("'ready()' invokes success callback", function () {
           var success = jasmine.createSpy('success');
            lookups.ready(success);
            flush$q();
            expect(success).toHaveBeenCalled();
        });
        it("has OrderStatus", function () {
            expect(lookups.OrderStatus).toBeDefined();
            expect(Object.keys(lookups.OrderStatus).length).toBeGreaterThan(1);
        });
        it("has OrderStatus.Pending", function () {
            expect(lookups.OrderStatus && lookups.OrderStatus.Pending).toBeDefined();
        });
        it("has products", function () {
            expect(lookups.products).toBeDefined();
            expect(lookups.products.length).toBeGreaterThan(1);
        });
        it("has pizza products", function () {
            expect(lookups.products).toBeDefined();
            var pizzas = lookups.products.byTag('pizza');
            expect(pizzas).toBeDefined();
            expect(pizzas.length).toBeGreaterThan(1);
        });
        it("has no spices (because not in test data)", function () {
            expect(lookups.products).toBeDefined();
            var pizzas = lookups.products.byTag('spice');
            expect(pizzas).toBeDefined();
            expect(pizzas.length).toEqual(0);
        });
        it("has productOptions", function () {
            expect(lookups.productOptions).toBeDefined();
            expect(lookups.productOptions.length).toBeGreaterThan(1);
        });
        it("has productSizes", function () {
            expect(lookups.productSizes).toBeDefined();
            expect(lookups.productSizes.length).toBeGreaterThan(1);
        });
    });

    describe("when remote server misbehaves with a 500", function () {
        var failSpy, serverFailMessage = 'uh oh!';

        beforeEach(function () {
            failSpy = jasmine.createSpy('fail').and.callFake(fail);
            $httpBackend.expectGET(lookupsUrlRe).respond(500, serverFailMessage);
        });

        it("'ready()' invokes fail callback", function () {
            lookups.ready(success, failSpy);
            flush();
            expect(failSpy).toHaveBeenCalled();
        });

        it("breeze logged failure", function () {
            lookups.ready();
            flush();
            expect($log.error.logs[0][0]).toMatch(serverFailMessage);
        });

        it("lookups logged failure seen by toastr", function () {
            lookups.ready();
            flush();
            expect(toastr.error).toHaveBeenCalled();
        });

        function fail(error){
            expect(error.message).toEqual(serverFailMessage);
        }

        function success() {
            expect.toFail('success callback should NOT have been called');
        }

        // flush http queue and trap thrown error which should be handled elsewhere
        // then flush $q to invoke promise callbacks
        function flush(){
            try {
                $httpBackend.flush();
                expect.toFail('expected to have thrown uncaught exception');
            } catch(error){/* will be hit; ignore it */}
            flush$q();
        }
    });

});