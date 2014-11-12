/* jshint -W117, -W030 */
describe('app.dashboard', function() {
    var controller;

    beforeEach(function() {
        module('app', function($provide) {
            specHelper.fakeRouteProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function($controller, $q, $rootScope, dataservice) {});            
    });

    beforeEach(function () {
        sinon.stub(dataservice, 'getAvengerCount', function () {
            var deferred = $q.defer();
            deferred.resolve(mockData.getMockAvengers().length);
            return deferred.promise;
        });

        sinon.stub(dataservice, 'ready', function () {
            var deferred = $q.defer();
            deferred.resolve({test: 123});
            return deferred.promise;
        });
      
        controller = $controller('Dashboard');
        $rootScope.$apply();
    });

    describe('Dashboard controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of Dashboard', function () {
                expect(controller.title).to.equal('Dashboard');
            });

            it('should have news', function () {
                expect(controller.news).to.not.be.empty;
            });

            it('should have at least 1 avenger', function () {
                expect(controller.avengers).to.have.length.above(0);
            });

            it('should have Avenger Count of 5', function () {
                expect(controller.avengerCount).to.equal(5);
            });
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});