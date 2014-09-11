describe("Basics - controller w/ async dataservice", function () {

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
            dataservice.getAvengers().then(function(avengers){
                vm.avengers = avengers;
            });
            $log.debug(vm.title + ' activated');
        }
    }

    // imagine this is the REAL dataservice
    function dataservice($http) {
        var service = {
            getAvengers: getAvengers
        };
        return service;
        ///////////
        function getAvengers(){

            return $http.get('/api/avengers')
                .then(function (data, status, headers, config) {
                    return data.data[0].data.results;
                })
                .catch(function(message) {
                    throw new Error('XHR failed to get Avengers\n' + message);
                });

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
        var $controller, $httpBackend, $log;

        function createController(){
            controller = $controller(controllerName);
            try {
                // flush both $httpBackend and $q promise queues
                $httpBackend.flush();
            } catch(e){
                $log.error(e);
            }
        }

        beforeEach(inject(function(_$controller_, _$httpBackend_,  _$log_){
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            $log = _$log_;
        }));

        describe("with unprepared $httpBackend", function () {

            beforeEach(function () {
                createController();
            });

            it("the $httpBackend threw up", function () {
                expect($log.error.logs[0]).to.match(/no more request expected/i);
            });

            it("controller was activated", function () {
                expect($log.debug.logs[0]).to.match(/activated/i);
            });

            it("controller does not have avengers", function () {
                expect(controller.avengers).to.be.empty; // because getAvengers failed
            });
        });

        describe("with prepared $httpBackend", function () {

            beforeEach(function () {
                // dataservice's $http.get handler looks for 'data.data[0].data.results' (yikes!)
                // the response needs to be the single element data.data array
                var response = [{data: {results: testctx.getMockAvengers()}}];

                // must know the server's API in the test
                $httpBackend.whenGET('/api/avengers').respond(response);
                createController();
            });

            it("controller was activated", function () {
                expect($log.debug.logs[0]).to.match(/activated/i);
            });

            it("controller does have avengers", function () {
                var len = controller.avengers.length;
                expect(len).above(1, "avengers.length is " +len);
            });
        });
    });


    /*** Try a dataservice test double ***/

    describe("when using mock dataservice", function () {

        // replace this app's dataservice with a test double
        beforeEach(module(mockBasicDataService));

        beforeEach(inject(function($controller, $rootScope){
            controller = $controller(controllerName);
            $rootScope.$apply(); // flush promise queue.
        }));

        it("controller was activated", inject(function ($log) {
            expect($log.debug.logs[0]).to.match(/activated/i);
        }));

        it("controller has avengers", function () {
            var len = controller.avengers.length;
            expect(len).above(1, "avengers.length is " +len);
        });

    });

    ///// Private //////////

    // Todo: move to specHelper.js if needed again
    function mockBasicDataService($provide) {
        $provide.factory('dataservice', dataservice);

        function dataservice($q) {
            return {
                getAvengers: getAvengers
            };
            ///////////
            function getAvengers(){
                // testctx is in specHelper.js
                return $q.when(testctx.getMockAvengers());
            }
        }
    };

});