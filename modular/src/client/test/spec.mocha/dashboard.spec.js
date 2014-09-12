/* global describe, it, beforeEach, afterEach, expect, inject, sinon, testctx */
/* global $controller, $httpBackend, $q, $rootScope */
/* jshint expr: true */
describe('dashboard', function() {
    var dataservice;
    var scope;
    var controller;
    var toastr;

    beforeEach(function() {
        module('app', function($provide) {
            testctx.fakeRouteProvider($provide);
            testctx.fakeLogger($provide);
        });
        testctx.injectDependencies(true);
        inject(function(_dataservice_, _toastr_) {
            dataservice = _dataservice_;
            toastr = _toastr_;
        });
    });

    beforeEach(function () {
        sinon.stub(dataservice, 'getAvengerCount', function () {
            var deferred = $q.defer();
            deferred.resolve(testctx.getMockAvengers().length);
            return deferred.promise;
        });

        sinon.stub(dataservice, 'ready', function () {
            var deferred = $q.defer();
            deferred.resolve({test: 123});
            return deferred.promise;
        });
    });


    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        controller = $controller('Dashboard as vm', {
            '$scope': scope
        });
        $rootScope.$apply();
    }));

    it('should have Dashboard controller', function () {
        expect(controller).not.to.equal(null);
    });

    it('should have title of Dashboard', function () {
        expect(scope.vm.title).to.equal('Dashboard');
    });

    it('should have Avenger Count of 5', function () {
        expect(scope.vm.avengerCount).to.equal(5);
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});