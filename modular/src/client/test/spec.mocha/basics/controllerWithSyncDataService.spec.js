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

    describe("when using stubbed 'real' dataservice ", function () {
        var dataservice,
            getAvengersSpy;


        beforeEach(inject(function($controller, _dataservice_){
            dataservice = _dataservice_;
            getAvengersSpy = sinon.stub(dataservice, 'getAvengers', fakeGetAvengers);
            controller = $controller(controllerName);
        }));

        it("has faked avengers immediately upon creation", function () {
            expect(controller.avengers.length).above(1);
        });

    });


    ////////// Private
    function fakeGetAvengers(){
        return [
            {
                "id": 1017109,
                "name": "Black Widow/Natasha Romanoff (MAA)",
                "description": "Natasha Romanoff, also known as Black Widow, is a world-renowned super spy and one of S.H.I.E.L.D.'s top agents. Her hand-to-hand combat skills, intelligence, and unpredictability make her a deadly secret weapon. True to her mysterious nature, Black Widow comes and goes as she pleases, but always appears exactly when her particular skills are needed.",
                "thumbnail": {
                    "path": "http://i.annihil.us/u/prod/marvel/i/mg/a/03/523219743a99b",
                    "extension": "jpg"
                }
            },
            {
                "id": 1017105,
                "name": "Captain America/Steve Rogers (MAA)",
                "description": "During World War II, Steve Rogers enlisted in the military and was injected with a super-serum that turned him into super-soldier Captain America! He's a skilled strategist and even more skilled with his shield, but it's his courage and good heart that makes Captain America both a leader and a true hero. ",
                "thumbnail": {
                    "path": "http://i.annihil.us/u/prod/marvel/i/mg/3/10/52321928eaa72",
                    "extension": "jpg"
                }
            }];
    }
});