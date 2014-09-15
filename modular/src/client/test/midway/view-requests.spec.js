describe('Midway: view requests', function() {
    var tester;
    beforeEach(function() {
        if (tester) {
            tester.destroy();
        }
        tester = ngMidwayTester('app');
    });

    beforeEach(function() {
        module('app', specHelper.fakeLogger);
    });

    it('should goto the dashboard by default', function(done) {
        tester.visit('/', function() {
            expect(tester.viewElement().html()).to.contain('id="dashboard-view"');
            done();
        });
    });

    it('should have a working avengers request', function(done) {
        tester.visit('/avengers', function() {
            expect(tester.viewElement().html()).to.contain('title="Avengers"');
            done();
        });
    });
});