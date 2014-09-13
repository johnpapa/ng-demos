//http://www.yearofmoo.com/2013/01/full-spectrum-testing-with-angularjs-and-karma.html
//https://github.com/yearofmoo-articles/AngularJS-Testing-Article
describe('Midway: controllers and routes', function() {
    var tester;
    beforeEach(function() {
        if (tester) {
            tester.destroy();
        }
        tester = ngMidwayTester('app');
    });

    beforeEach(function () {
        module('app', specHelper.fakeLogger);
    });

    it('should load the Avengers controller properly when /avengers route is accessed', function(done) {
        tester.visit('/avengers', function() {
            expect(tester.path()).to.equal('/avengers');
            var current = tester.inject('$route').current;
            var controller = current.controller;
            var scope = current.scope;
            expect(controller).to.equal('Avengers');
            done();
        });
    });

    it('should load the Dashboard controller properly when / route is accessed', function(done) {
        tester.visit('/', function() {
            expect(tester.path()).to.equal('/');
            var current = tester.inject('$route').current;
            var controller = current.controller;
            var scope = current.scope;
            expect(controller).to.equal('Dashboard');
            done();
        });
    });

});