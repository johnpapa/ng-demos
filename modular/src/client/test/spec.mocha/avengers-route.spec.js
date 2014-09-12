/* global describe, it, beforeEach, afterEach, expect, inject, sinon, testctx */
/* global $controller, $httpBackend, $location, $q, $rootScope, $route */
/* jshint expr: true */
describe('avengers', function () {
    describe('route', function () {
        var dataservice;
        var scope;
        var controller;
        var toastr;

        beforeEach(function() {
            module('app', testctx.fakeLogger);
            testctx.injectDependencies(true);
            inject(function(_dataservice_, _toastr_) {
                dataservice = _dataservice_;
                toastr = _toastr_;
            });

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