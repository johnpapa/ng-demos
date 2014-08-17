describe('layout', function () {
    describe('sidebar', function () {
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
            scope = $rootScope.$new();
            controller = $controller('Sidebar as vm', {
                '$scope': scope
            });
        });

        it('should have isCurrent() for / to return `current`', function () {
            $httpBackend.when('GET', 'app/dashboard/dashboard.html').respond(200);
            $location.path('/');
            $httpBackend.flush();
            $rootScope.$apply();
            expect(scope.vm.isCurrent($route.current)).to.equal('current');
        });

        it('should have isCurrent() for /avengers to return `current`', function () {
            $httpBackend.when('GET', 'app/avengers/avengers.html').respond(200);
            $location.path('/avengers');
            $httpBackend.flush();
            $rootScope.$apply();
            expect(scope.vm.isCurrent($route.current)).to.equal('current');
        });

        it('should have isCurrent() for non route not return `current`', function () {
            $httpBackend.when('GET', 'app/dashboard/dashboard.html').respond(200);
            $location.path('/invalid');
            $httpBackend.flush();
            $rootScope.$apply();
            expect(scope.vm.isCurrent({title: 'invalid'})).not.to.equal('current');
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
});