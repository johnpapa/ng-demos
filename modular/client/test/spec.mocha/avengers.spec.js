describe('avengers', function () {
    describe('avengers', function () {
        var $controller,
            dataservice,
            $httpBackend,
            $location,
            $q,
            $rootScope,
            $route,
            scope,
            toastr;

        beforeEach(function () {
            module('app', fakeLogger);
            inject(function (_$controller_, _$httpBackend_, _$location_, _$q_, _$rootScope_, _$route_, _dataservice_, _toastr_) {
                $controller = _$controller_;
                $httpBackend = _$httpBackend_;
                $location = _$location_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $route = _$route_;
                dataservice = _dataservice_;
                toastr = _toastr_;
            });
        });

        beforeEach(function () {
            $httpBackend.when('GET', 'app/dashboard/dashboard.html').respond(200);
//        $httpBackend.expectGET(/\w+.html/).respond(200, '');
            $httpBackend.flush();

            sinon.stub(dataservice, 'getAvengers', function () {
                var deferred = $q.defer();
                deferred.resolve(testctx.getMockAvengers());
                return deferred.promise;
            });

            sinon.stub(dataservice, 'ready', function () {
                var deferred = $q.defer();
                deferred.resolve({test: 123});
                return deferred.promise;
            });

            scope = $rootScope.$new();
            controller = $controller('Avengers as vm', {
                '$scope': scope
            });
        });

        it('should have title of Avengers', function () {
            $rootScope.$apply();
            expect(scope.vm.title).to.equal('Avengers');
        });

        it('should have 5 Avengers', function () {
            $rootScope.$apply();
            expect(scope.vm.avengers.length).to.equal(5);
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
});