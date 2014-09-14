describe('layout', function () {
    describe('sidebar', function () {
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
        });

        beforeEach(function () {
            controller = $controller('Sidebar');
        });

        it('should have isCurrent() for / to return `current`', function () {
            $httpBackend.when('GET', 'app/dashboard/dashboard.html').respond(200);
            $location.path('/');
            $httpBackend.flush();
            $rootScope.$apply();
            expect(controller.isCurrent($route.current)).to.equal('current');
        });

        it('should have isCurrent() for /avengers to return `current`', function () {
            $httpBackend.when('GET', 'app/avengers/avengers.html').respond(200);
            $location.path('/avengers');
            $httpBackend.flush();
            $rootScope.$apply();
            expect(controller.isCurrent($route.current)).to.equal('current');
        });

        it('should have isCurrent() for non route not return `current`', function () {
            $httpBackend.when('GET', 'app/dashboard/dashboard.html').respond(200);
            $location.path('/invalid');
            $httpBackend.flush();
            $rootScope.$apply();
            expect(controller.isCurrent({title: 'invalid'})).not.to.equal('current');
        });

        specHelper.verifyNoOutstandingHttpRequests();
    });
});