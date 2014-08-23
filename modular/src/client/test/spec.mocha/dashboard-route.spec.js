describe('dashboard', function () {
    describe('route', function () {
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
            module('app', testctx.fakeLogger);
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
            $httpBackend.expectGET('app/dashboard/dashboard.html').respond(200);
        });

        it('should map / route to dashboard View template', function () {
            expect($route.routes['/'].templateUrl).
                to.equal('app/dashboard/dashboard.html');
        });

        it('should route / to the dashboard View', function () {
            $location.path('/');
            $rootScope.$digest();
            expect($route.current.templateUrl).to.equal('app/dashboard/dashboard.html');
        });

        it('should route /invalid to the otherwise (dashboard) route', function () {
            $location.path('/invalid');
            $rootScope.$digest();
            expect($route.current.templateUrl).to.equal('app/dashboard/dashboard.html');
        });
    });
});