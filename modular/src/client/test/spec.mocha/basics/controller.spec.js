describe("Basics - controller:", function () {

    /*** Create the module that we'll test in this Basics spec ***/
    var configTitle = 'Avengers Listing',
        controllerName = 'testController';

    angular
        .module('app.controller.test', [])
        .value('config', { title: configTitle})
        .controller(controllerName , testController);

    // Controller to test (imagine it's a real controller in our app)
    function testController($log, config) {
        var vm = this;
        vm.avengers = [];
        vm.title = config.title;

        activate();

        ///////////
        function activate(){
            $log.log(vm.title + ' activated');
        }
    }


    /*** Testing begins ***/

    var controller;

    beforeEach(module('app.controller.test'));

    /*** Start using the module registry ***/
    // Create an instance of the controller before each test
    // This first `angular.mock.inject` closes module registration and modification
    beforeEach(inject(function($controller){
        // $controller is an Ng service that makes controller instances
        // controller is an instance of `testController`
        controller = $controller(controllerName, {});
    }));



    /*** Let's test! ***/

    it("exists", function () {
        expect(controller).to.exist;
    });


    it("gets its title from configuration", function () {
        expect(controller.title).to.equal(configTitle);
    });


    it("activates immediately", inject(function ($log) {
        // we can only infer that this is true because
        // we know that activation results in a log entry
        // $log has been mocked by ngMocks and can tell us it's been called
        // Confirm that the msg in the first call to $log.log indicates activation
        expect($log.log.logs[0]).to.match(/activated/i);
    }));
});