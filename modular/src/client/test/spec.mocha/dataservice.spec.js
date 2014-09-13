/* global describe, it, beforeEach, afterEach, expect, inject, sinon, specHelper */
/* global $controller, $httpBackend, $location, $q, $rootScope, $route */
/* jshint expr: true */
describe('dataservice', function () {
    var dataservice;
    var scope;
    var toastr;
    var mocks = {};

    beforeEach(function () {
        module('app', function($provide) {
            specHelper.fakeRouteProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injectDependencies(true);
        inject(function (_dataservice_, _toastr_) {
            dataservice = _dataservice_;
            toastr = _toastr_;
        });
        
        mocks.maaData = [{ 
            data: {results: specHelper.getMockAvengers()}
        }];
        // sinon.stub(dataservice, 'getAvengers', function () {
        //     var deferred = $q.defer();
        //     deferred.resolve(specHelper.getMockAvengers());
        //     return deferred.promise;
        // });
    });

    it('should be registered', function() {
        expect(dataservice).not.to.equal(null);
    });

    describe('getAvengers function', function () {
        it('should exist', function () {
            expect(dataservice.getAvengers).not.to.equal(null);
        });
        
        it('should return 5 Avengers', function (done) {
            $httpBackend.when('GET', '/api/maa').respond(200, mocks.maaData);
            dataservice.getAvengers().then(function(data) {
                expect(data.length).to.equal(5);
                done();
            });
            $rootScope.$apply();
            $httpBackend.flush();
        });

        it('should contain Black Widow', function (done) {
            $httpBackend.when('GET', '/api/maa').respond(200, mocks.maaData);
            dataservice.getAvengers().then(function(data) {
                var hasBlackWidow = data.some(function isPrime(element, index, array) {
                    return element.name.indexOf('Black Widow') >= 0;
                });
                expect(hasBlackWidow).to.be.true;
                done();
            });
            $rootScope.$apply();
            $httpBackend.flush();
        });
    });

    describe('getAvengerCount function', function () {
        it('should exist', function () {
            expect(dataservice.getAvengerCount).not.to.equal(null);
        });

        it('should return 11 Avengers', function (done) {
            dataservice.getAvengerCount().then(function(count) {
                expect(count).to.equal(11);
                done();
            });
            $rootScope.$apply();
        });
    });

    describe('getAvengersCast function', function () {
        it('should exist', function () {
            expect(dataservice.getAvengersCast).not.to.equal(null);
        });

        it('should return 11 Avengers', function (done) {
            dataservice.getAvengersCast().then(function(data) {
                expect(data.length).to.equal(11);
                done();
            });
            $rootScope.$apply();
        });

        it('should contain Natasha', function (done) {
            dataservice.getAvengersCast()
                .then(function(data) {
                    var hasBlackWidow = data.some(function isPrime(element, index, array) {
                        return element.character.indexOf('Natasha') >= 0;
                    });
                    expect(hasBlackWidow).to.be.true;
                    done();
                });
            $rootScope.$apply();
        });
    });

    describe('ready function', function () {
        it('should exist', function () {
            expect(dataservice.ready).not.to.equal(null);
        });

        it('should return a resolved promise', function (done) {
            dataservice.ready()
                .then(function(data) {
                    expect(true).to.be.true;
                    done();
                }, function(data) {
                    expect('promise rejected').to.be.true;
                    done();
                });
            $rootScope.$apply();
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});