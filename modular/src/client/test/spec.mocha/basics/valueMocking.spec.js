describe("Basics - value mocking:", function () {

    /*** Create the module that we'll test in this Basics spec ***/

    var apiBaseUri = '/api/marvel';  // the 'real' base for our server api calls

    angular
        .module('app.value.test', [])
        .value('config', {
            apiBaseUri: apiBaseUri
        });

    /*** Testing begins ***/

    beforeEach(module('app.value.test'));

    /*** same as value.spec.js to this point ***/

    // We'll change the apiBaseUri to a different server, our test server
    mockApiBaseUri = '/api/to/who/knows/where'

    beforeEach(module(function($provide){
        // We redefine the 'config' component by re-registering with a different value
        $provide.value('config', {
            apiBaseUri: mockApiBaseUri
        });
    }));

    // The first use of inject in THIS test path
    // it closes the module cookbook to further modification
    it('config.apiBaseUri has mocked value', inject(function(config){
        expect(config.apiBaseUri).to.equal(mockApiBaseUri);
    }));

});
