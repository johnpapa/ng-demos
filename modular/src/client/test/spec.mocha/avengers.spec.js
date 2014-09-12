/* global describe, it, beforeEach, afterEach, expect, inject, sinon, testctx */
/* global $controller, $httpBackend, $location, $q, $rootScope, $route */
/* jshint expr: true */
describe('avengers', function() {
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
        sinon.stub(dataservice, 'getAvengers', function() {
            var deferred = $q.defer();
            deferred.resolve(testctx.getMockAvengers());
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

    it('should have Avengers controller', function() {
        expect(controller).not.to.equal(null);
    });

    it('should have title of Avengers', function() {
        expect(controller.title).to.equal('Avengers');
    });

    it('should have 5 Avengers', function() {
        expect(controller.avengers.length).to.equal(5);
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});