describe('avengers', function () {
    describe('avengers', function () {
        var $controller,
            dataservice,
            $httpBackend,
            $location,
            $q,
            $rootScope,
            $route,
            scope;

        beforeEach(function () {
            module('app');
            inject(function (_$controller_, _$httpBackend_, _$location_, _$q_, _$rootScope_, _$route_, _dataservice_) {
                $controller = _$controller_;
                $httpBackend = _$httpBackend_;
                $location = _$location_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $route = _$route_;
                dataservice = _dataservice_;
            });
        });

        beforeEach(function () {
            $httpBackend.when('GET', '/app/dashboard/dashboard.html').respond(200);
//        $httpBackend.expectGET(/\w+.html/).respond(200, '');
            $httpBackend.flush();

            spyOn(dataservice, 'getAvengers').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(specHelper.getMockAvengers());
                return deferred.promise;
            });

            spyOn(dataservice, 'ready').and.callFake(function () {
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
            expect(scope.vm.title).toEqual('Avengers');
        });

        it('should have 5 Avengers', function () {
            $rootScope.$apply();
            expect(scope.vm.avengers.length).toEqual(5);
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
});