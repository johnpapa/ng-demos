/* jshint -W117, -W030 */
describe('app.avengers', function() {
    var controller;

    beforeEach(function() {
        module('app', function($provide) {
            specHelper.fakeRouteProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function($controller, $q, $rootScope, dataservice) {});
    });

    beforeEach(function () {
        sinon.stub(dataservice, 'getAvengers', function() {
            var deferred = $q.defer();
            deferred.resolve(mockData.getMockAvengers());
            return deferred.promise;
        });

        sinon.stub(dataservice, 'ready', function() {
            var deferred = $q.defer();
            deferred.resolve({test: 123});
            return deferred.promise;
        });

        controller = $controller('Avengers');
        $rootScope.$apply();
    });

    describe('Avengers controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of Avengers', function() {
                expect(controller.title).to.equal('Avengers');
            });

            it('should have 5 Avengers', function() {
                expect(controller.avengers).to.have.length(5);
            });
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});