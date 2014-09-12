describe("Basics - controller w/ sync dataservice:", function () {
    "use strict";

    var controller,
        controllerName  = 'basicDataController';

    beforeEach(module('basics'));

    describe("when using 'real' dataservice", function () {

        beforeEach(inject(function($controller){

            expect(createController).to.throw(/way too hard/);

            function createController(){
                controller = $controller(controllerName);
            }
        }));

        it("controller creation fails", function () {
            expect(controller).to.not.exist; // because we trapped failure in beforeEach
        });
    });


    describe("when stub the 'real' dataservice method", function () {
        var stub;

        beforeEach(inject(function($controller, syncDataservice){
            stub = sinon.stub(syncDataservice, 'getAvengers', testctx.getMockAvengers);
            controller = $controller(controllerName);
        }));

        it("has test avengers immediately upon creation", function () {
            expect(controller.avengers.length).above(1);
        });

        it("dataservice.getAvengers was called", function () {
            expect(stub).to.have.been.calledOnce;
        });
    });


    describe("when create controller with mock dataservice", function () {

        beforeEach(inject(function($controller){

            // mock service object whose getAvengers() returns test data
            var mockSyncDataservice = {
                getAvengers: mockGetAvengers
            };

            // 'local' values that the $controller service passes to
            //  the constructor instead of values from the injector
            var ctorArgs = {
                syncDataservice: mockSyncDataservice
            };

            controller = $controller(controllerName, ctorArgs);
        }));

        it("has test avengers immediately upon creation", function () {
            expect(controller.avengers.length).above(1);
        });
    });


    describe("when re-register with mock dataservice", function () {

        beforeEach(module(function($provide){
            $provide.factory('syncDataservice', mockSyncDataservice);
        }));

        beforeEach(inject(function($controller){
            controller = $controller(controllerName);
        }));

        it("has test avengers immediately upon creation", function () {
            expect(controller.avengers.length).above(1);
        });

        // definition of a mock service whose getAvengers() returns test data
        function mockSyncDataservice(){
            return {
                getAvengers: testctx.getMockAvengers
            };
        }
    });

    ///////// Private
    function mockGetAvengers(){
        // testctx is in specHelper.js
        return testctx.getMockAvengers();
    }


});