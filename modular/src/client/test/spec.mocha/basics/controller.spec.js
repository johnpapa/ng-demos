describe("Basics - controller", function () {
    /*
     * Registers a new test module with global angular, 'app.test'
     * Unlike your production module (e.g., 'app')
     * the 'app.test' module is redefined with each new individual test run
     * Same substance as 'controller-alternative.spec' ... different setup style
     * You'll likely prefer this style.
     */
    var controller,
        controllerName = 'testController';

    /*** Define a controller and configuration for our test module  ***/

    // Application configuration values ... to be injected in app components
    var testConfig = { title: 'Avengers Listing'};

    // Controller to test (imagine its a real controller in our app)
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


    /*** Setup module registry ***/

    beforeEach(function(){
        angular
            .module('app.test', [])  // 'app.test' is a new module that is redefined over and over
            .value('config', testConfig)
            .controller(controllerName , testController);

        module('app.test');
    });



    /*** Start using the module registry ***/
    // The first `angular.mock.inject` closes module registration and modification

    // Create an instance of the controller before each test
    beforeEach(inject(function($controller){
        // $controller is an Ng service that makes controller instances
        // controller is an instance of `testController`
        controller = $controller(controllerName);
    }));



    /*** Let's test! ***/

    it("exists", function () {
        expect(controller).to.exist;
    });


    it("gets its title from configuration", function () {
        expect(controller.title).to.equal(testConfig.title);
    });


    it("activates immediately", inject(function ($log) {
        // we can only infer that this is true because
        // we know that activation results in a log entry
        // $log has been mocked by ngMocks and can tell us it's been called
        // Confirm that the msg in the first call to $log.log indicates activation
        expect($log.log.logs[0]).to.match(/activated/i);
    }));
});