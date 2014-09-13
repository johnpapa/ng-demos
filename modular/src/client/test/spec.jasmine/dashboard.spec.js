describe('dashboard', function () {
    describe('dashboard', function () {
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
            module('app');
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
            $httpBackend.when('GET', '/app/dashboard/dashboard.html').respond(200);
//        $httpBackend.expectGET(/\w+.html/).respond(200, '');
            $httpBackend.flush();

            spyOn(dataservice, 'getAvengerCount').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(specHelper.getMockAvengers().length);
                return deferred.promise;
            });

            spyOn(dataservice, 'ready').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve({test: 123});
                return deferred.promise;
            });
        });


        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller('Dashboard as vm', {
                '$scope': scope,
                'dataservice': dataservice
            });
        }));

        it('should have title of Dashboard', function () {
            $rootScope.$apply();
            expect(scope.vm.title).toEqual('Dashboard');
        });

        it('should have Avenger Count of 5', function () {
            $rootScope.$apply();
            expect(scope.vm.avengerCount).toEqual(5);
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
});