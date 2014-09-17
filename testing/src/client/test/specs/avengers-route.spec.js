describe('avengers', function () {
    var htmlTemplate = 'app/avengers/avengers.html';
    var avengersState = 'avengers';

    describe('route', function () {
        beforeEach(function() {
            module('app', specHelper.fakeLogger);
            specHelper.injector(function($httpBackend, $location, $rootScope, $state, $templateCache) {});
            $httpBackend.expectGET(htmlTemplate).respond(200);
            $templateCache.put(htmlTemplate, '');
        });

        it('should map /avengers state to avengers View template', function () {
            var state = $state.get(avengersState);
            expect(state.templateUrl).to.equal(htmlTemplate);
        });

        describe('when routing to /avengers', function() {
            it('state should be avengers', function () {
                $location.path('/avengers');
                $rootScope.$apply();
                expect($state.current.name).to.equal(avengersState);
            });

            it('template should be avengers.html', function () {
                $location.path('/avengers');
                $rootScope.$apply();
                expect($state.current.templateUrl).to.equal(htmlTemplate);
            });
        });

        describe('when going to state avengers', function() {
            it('state should be avengers', function () {
                $state.go(avengersState);
                $rootScope.$apply();
                expect($state.current.name).to.equal(avengersState);
            });

            it('template should be avengers.html', function () {
                $state.go(avengersState);
                $rootScope.$apply();
                expect($state.current.templateUrl).to.equal(htmlTemplate);
            });
        });
    });
});
