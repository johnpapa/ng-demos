/* global describe, it, beforeEach, afterEach, expect, inject, sinon, specHelper */
/* global $controller, $httpBackend, $location, $q, $rootScope, $route */
/* jshint expr: true */
describe('app.avengers', function() {
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
        sinon.stub(dataservice, 'getAvengers', function() {
            var deferred = $q.defer();
            deferred.resolve(specHelper.getMockAvengers());
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

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});