describe('avengers', function () {
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
            module('app', loggerFake);
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
            $httpBackend.expectGET('app/avengers/avengers.html').respond(200);
        });

        it('should map /avengers route to avengers View template', function () {
            expect($route.routes['/avengers'].templateUrl).
                to.equal('app/avengers/avengers.html');
        });

        it('should route / to the avengers View', function () {
            $location.path('/avengers');
            $rootScope.$apply();
            expect($route.current.templateUrl).to.equal('app/avengers/avengers.html');
        });
    });
});