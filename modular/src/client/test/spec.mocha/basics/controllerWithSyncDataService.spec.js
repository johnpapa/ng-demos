describe("Basics - controller w/ sync dataservice", function () {

    var controller,
        controllerName = 'testController';

    /*** Define a controller and configuration for our test module  ***/

    // Application configuration values ... to be injected in app components
    var testConfig = { title: 'Avengers Listing'};

    // Controller to test (imagine its a real controller in our app)
    function testController($log, config, dataservice) {
        var vm = this;
        vm.avengers = [];
        vm.title = config.title;

        activate();

        ///////////
        function activate(){
            vm.avengers = dataservice.getAvengers();
            $log.log(vm.title + ' activated');
        }
    }

    // imagine this is the REAL DEAL
    function dataservice() {
        var service = {
            getAvengers: getAvengers
        };
        return service;
        ///////////
        function getAvengers(){
            throw new Error('getting Avengers is way too hard');
        }
    }

    /*** Setup module registry ***/

    beforeEach(function(){
        angular
            .module('app.test', [])  // 'app.test' is a new module that is redefined over and over
            .factory('dataservice', dataservice)
            .controller(controllerName , testController)
            .value('config', testConfig) ;

        module('app.test');
    });

    /*** Start using the module registry ***/

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




    describe("when using stubbed 'real' dataservice", function () {
        var dataservice,
            getAvengersSpy;


        beforeEach(inject(function($controller, _dataservice_){
            dataservice = _dataservice_;
            getAvengersSpy = sinon.stub(dataservice, 'getAvengers', testctx.getMockAvengers);
            controller = $controller(controllerName);
        }));

        it("has test avengers immediately upon creation", function () {
            expect(controller.avengers.length).above(1);
        });

    });




    describe("when using mock dataservice", function () {

        beforeEach(module(function($provide){

            $provide.factory('dataservice', function mockDataservice(){
                return {
                    // testctx is in specHelper.js
                    getAvengers: testctx.getMockAvengers
                }
            });

        }));

        beforeEach(inject(function($controller){
            controller = $controller(controllerName);
        }));

        it("has test avengers immediately upon creation", function () {
            expect(controller.avengers.length).above(1);
        });

    });
});