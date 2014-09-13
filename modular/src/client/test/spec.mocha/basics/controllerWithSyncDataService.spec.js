describe('Basics - controller w/ sync dataservice:', function() {
    'use strict';

    var controller;
    var controllerName = 'basicDataController';

    beforeEach(module('basics'));

    describe('when using "real" dataservice', function() {

        beforeEach(inject(function($controller) {

            expect(createController).to.throw(/way too hard/);

            function createController() {
                controller = $controller(controllerName);
            }
        }));

        it('controller creation fails', function() {
            expect(controller).to.not.exist; // because we trapped failure in beforeEach
        });
    });

    describe('when stub the real dataservice method', function() {
        var stub;

        beforeEach(inject(function($controller, syncDataservice) {

            // replace the problematic 'getAvengers' method with a mock version
            stub = sinon.stub(
                syncDataservice,
                'getAvengers',
                specHelper.getMockAvengers);

            controller = $controller(controllerName);
        }));

        it('has avengers immediately after creation', function() {
            expect(controller.avengers.length).above(1);
        });

        it('dataservice.getAvengers was called', function() {
            expect(stub).to.have.been.calledOnce;
        });
    });

    describe('when create controller with mock dataservice', function() {

        beforeEach(inject(function($controller) {

            // 'local' values that the $controller service passes to
            //  the constructor instead of values from the injector
            var ctorArgs = {
                // mock service instance swhose getAvengers() returns test data
                syncDataservice: {getAvengers: specHelper.getMockAvengers}
            };

            controller = $controller(controllerName, ctorArgs);
        }));

        it('has avengers immediately after creation', function() {
            expect(controller.avengers.length).above(1);
        });
    });

    describe('when re-register with mock dataservice', function() {

        beforeEach(module(function($provide) {
            $provide.factory('syncDataservice', mockSyncDataservice);
        }));

        beforeEach(inject(function($controller) {
            controller = $controller(controllerName);
        }));

        it('has avengers immediately after creation', function() {
            expect(controller.avengers.length).above(1);
        });

        // definition of a mock service whose getAvengers() returns test data
        function mockSyncDataservice() {
            return {getAvengers: specHelper.getMockAvengers};
        }
    });

});