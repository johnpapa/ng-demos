describe("Basics - controller (alternative):", function () {
    /*
     * Registers the imaginary app components directly with the angular mock module registry
     *
     * Reveals the magic behind module registration.
     * Same substance as 'controller.spec' ... different setup style
     */
    var controller,
        controllerName = 'testController';

    /*** Define a controller and configuration in our imaginary application  ***/

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

    // Register our test controller anonymously with `angular.mock.module`.
    // We don't need to mention any actual modules because our test controller doesn't depend on them.
    // If we were testing an app controller our module setup might be more like: beforeEach(module('app'));
    beforeEach(module(function($controllerProvider){
        // Effectively same as `angular.module('app').controller(controllerName, testController)
        $controllerProvider.register(controllerName, testController);
    }));

    // Register a test configuration anonymously with `angular.mock.module`.
    // could have combined with `beforeEach` above
    beforeEach(module(function($provide){
        // Effectively same as `angular.module('app').value('config', testConfig)
        $provide.value('config', testConfig);
    }));



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






    /*** ControllerAs style  ***/

    /*

    beforeEach(inject(function($controller, $rootScope){

        // Need a scope for controllerAs to attach the "as ..." part
        // Ng insists that this scope be passed in the 'locals' argument
        // The controller doesn't know about it and doesn't care
        var scope = $rootScope.$new(); // child scope for the controllerAs
        var locals = {
            $scope: scope
        };

        controller = $controller(controllerName + ' as vm', locals);

        // controllerAs added a `vm` property to the child scope
        // whose value is the same as the controller instance
        expect(scope.vm).to.equal(controller);
    }));

    */
});
