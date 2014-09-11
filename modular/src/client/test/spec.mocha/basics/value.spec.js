describe("Basics - value:", function () {
    /*
     * Registers a new test module with global angular, 'app.test'
     * In Basics, 'app.test' is a stand-in for a production app module.
     * Unlike your production module (e.g., 'app')
     * the 'app.test' module is redefined with each new individual test run
     *
     * DO NOT move 'app.test' module definition outside of a `beforeEach`
     * because 'app.test' redefinition elsewhere will wipe it out,
     * breaking other tests unpredictably
     */

    /*** Setup module registry ***/
    var appConfig = {
    	apiBaseUri: '/api/marvel'
    };

    beforeEach(function () {
        angular
            .module('app.test', [])
            .value('config', appConfig);

        module('app.test');
    });

    // The first use of inject in THIS test path;
    // it closes the module cookbook to further modification
    it('config.apiBaseUri has expected original value', inject(function(config){
        expect(config.apiBaseUri).to.equal(appConfig.apiBaseUri);
    }));

    // QUESTION FOR YOU: Is this component really worth testing?






    describe("when config is replaced during setup", function () {
        var mockConfig = {
            apiBaseUri: '/api/to/who/knows/where'
        };

        beforeEach(function () {
            module(function($provide){
                $provide.value('config', mockConfig);
            });
        });

        // The first use of inject in THIS test path
        // it closes the module cookbook to further modification
        it('config.apiBaseUri has mocked value', inject(function(config){
            expect(config.apiBaseUri).to.equal(mockConfig.apiBaseUri);
        }));
    });

});
