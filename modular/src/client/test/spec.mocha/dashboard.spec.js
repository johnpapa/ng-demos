describe('app.dashboard', function() {
    var dataservice;
    var scope;
    var controller;
    var toastr;

    beforeEach(function() {
        module('app', function($provide) {
            specHelper.fakeRouteProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injectDependencies(true);
        inject(function(_dataservice_, _toastr_) {
            dataservice = _dataservice_;
            toastr = _toastr_;
        });
    });

    beforeEach(function () {
        sinon.stub(dataservice, 'getAvengerCount', function () {
            var deferred = $q.defer();
            deferred.resolve(specHelper.getMockAvengers().length);
            return deferred.promise;
        });

        sinon.stub(dataservice, 'ready', function () {
            var deferred = $q.defer();
            deferred.resolve({test: 123});
            return deferred.promise;
        });
    });

    beforeEach(inject(function ($rootScope, $controller) {
        controller = $controller('Dashboard');
        $rootScope.$apply();
    }));

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