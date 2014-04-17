/************************
 * Test the Zza web api of the LIVE SERVER with asynchronous specs
 * with and without BreezeJS
 * requires the ngMidwayTester
 *******************************/

describe('When querying Zza web api with $http', function () {
    'use strict';

    var $http, tester = null;
    var testFns = window.testFns,
        base = testFns.serviceBase,
        serviceName = base+testFns.serviceName;

    beforeEach(function () {
        tester = ngMidwayTester('ng');
        $http = tester.inject('$http');
    });

    afterEach(function () {
        // destroy the tester after each test
        tester.destroy();
        tester = null;
    });

    it('can reach the node server', function (done) {
        var url = base+'ping';
        $http.post(url,  {"message": "hello, server"})
            .then(function(response){
                var data = response.data;
                console.log("ping response was "+data);
                expect(data).toMatch(/pinged/);
            })
            .catch(function(error){
                expect.toFail('Server ping at '+url+' failed. Is the app server running?'+
                    'Are you sure the base ('+base+') is correct for that server?'+
                    'Error was '+JSON.stringify(error));
            })
            .finally(done);
    });

    it('can get OrderStatuses', function (done) {
        var url = serviceName+'OrderStatuses';
        $http.get(url)
            .then(function(response){
                var data = response.data;
                console.log("'OrderStatuses' responded with array of length "+ (data && data.length));
                expect(data.length).toBeGreaterThan(0);
            })
            .catch(function(error){
                expect.toFail('fetch of OrderStatuses at '+url+'failed with  '+JSON.stringify(error));
            })
            .finally(done);
    });

});