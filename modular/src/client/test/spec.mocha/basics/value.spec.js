describe("Basics - value:", function () {

    /*** Create the module that we'll test in this Basics spec ***/

    var apiBaseUri = '/api/marvel';  // the 'real' base for our server api calls

    angular
        .module('app.value.test', [])
        .value('config', {
            apiBaseUri: apiBaseUri
        });

    /*** Testing begins ***/

    beforeEach(module('app.value.test'));

    // The first use of inject in THIS test path;
    // it closes the module cookbook to further modification
    it('config.apiBaseUri has expected original value', inject(function(config){
        expect(config.apiBaseUri).to.equal(apiBaseUri);
    }));

    // QUESTION FOR YOU: Is this component really worth testing?

});
