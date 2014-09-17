describe('dashboard', function () {
    var htmlTemplate = 'app/dashboard/dashboard.html';
    var dashboardState = 'dashboard';

    describe('route', function () {
        beforeEach(function() {
            module('app', specHelper.fakeLogger);
            specHelper.injector(function($location, $rootScope, $state, $templateCache) {});
            $templateCache.put(htmlTemplate, '');
        });

        it('should map /dashboard state to dashboard View template', function () {
            var state = $state.get(dashboardState);
            expect(state.templateUrl).to.equal(htmlTemplate);
        });

        describe('when routing to /dashboard', function() {
            it('state should be dashboard', function () {
                $location.path('/dashboard');
                $rootScope.$apply();
                expect($state.current.name).to.equal(dashboardState);
            });

            it('template should be dashboard.html', function () {
                $location.path('/dashboard');
                $rootScope.$apply();
                expect($state.current.templateUrl).to.equal(htmlTemplate);
            });
        });

        describe('when going to state dashboard', function() {
            it('state should be dashboard', function () {
                $state.go(dashboardState);
                $rootScope.$apply();
                expect($state.current.name).to.equal(dashboardState);
            });

            it('template should be dashboard.html', function () {
                $state.go(dashboardState);
                $rootScope.$apply();
                expect($state.current.templateUrl).to.equal(htmlTemplate);
            });
        });
    });
});
