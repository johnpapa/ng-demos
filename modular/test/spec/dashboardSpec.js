describe('Dashboard', function () {
    var $controller,
        dataservice,
        $httpBackend,
        $q,
        $rootScope,
        scope,
        toastr;

    beforeEach(function () {
        module('app');
        inject(function (_$controller_, _$httpBackend_, _$q_, _$rootScope_, _dataservice_, _toastr_) {
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            dataservice = _dataservice_;
            toastr = _toastr_;
        });
    });

    beforeEach(function () {
//            $httpBackend.expectGET('/app/dashboard/dashboard.html').respond(200, {});
        $httpBackend.expectGET(/\w+.html/).respond(200, '');
        $httpBackend.flush();

        spyOn(dataservice, 'getAvengerCount').and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve(testctx.getMockAvengers().length);
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

    afterEach (function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});