describe('dashboard', function () {
    describe('route', function () {
        var dataservice;
        var scope;
        var controller;
        var toastr;

        beforeEach(function() {
            module('app', specHelper.fakeLogger);
            specHelper.injectDependencies(true);
            inject(function(_dataservice_, _toastr_) {
                dataservice = _dataservice_;
                toastr = _toastr_;
            });
            
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