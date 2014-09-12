describe("Basics - value redefined:", function () {

    beforeEach(module('basics'));

    // A new apiBaseUri to reach a different server, our test server
    var mockApiBaseUri = '/api/to/who/knows/where/';

    beforeEach(module(function($provide){

        // Re-define the entire 'config' component by
        // re-registering with a completely new value
        $provide.value('config', {
            apiBaseUri: mockApiBaseUri,
            appTitle:   'Mock Avengers'
        });

    }));

    // The first use of inject closes the module cookbook to further modification
    it('config.apiBaseUri has mocked value',
        inject(function(config){
            expect(config.apiBaseUri).to.equal(mockApiBaseUri);
    }));

});
