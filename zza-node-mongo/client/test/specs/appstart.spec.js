// Prove that testing works at all
describe('When the app starts', function () {
    'use strict';

    describe("when 'appStart' service is stubbed out ", function () {
        var appStart = {
            start: jasmine.createSpy('start')
        };

        // see this inside testFns.beforeEachApp();
        beforeEach(function() {
            module('app',
                // an example of anonymous module function that overrides an app service
                // this one is based on testFns.appStartMock
                function ($provide) {
                    $provide.value('appStart', appStart);
                }
            );

            inject();// use of injector triggers 'app' load
        });

        it("app calls appStart.start", function () {
            expect(appStart.start).toHaveBeenCalled();
        });
    });

    describe("when 'dataservice' is stubbed out ", function () {
        var $log;

        beforeEach(function() {
            // dataservice service spy
            var dataservice = {
                // stub the 'ready' method
                ready: jasmine.createSpy('ready')
            };
            module('app', function ($provide) {
                $provide.value('dataservice', dataservice);
            });

            // trigger 'app' load and get $log service
            inject(function(_$log_){
                $log = _$log_;
            });
        });

        it("logs that the app is loaded and running", function () {
            var msgRe = /is loaded and running on/;
            var wasLogged = false;
            try {
                wasLogged = msgRe.test($log.info.logs[0][0]);
            } catch (e) {/* let fail fall through*/}
            expect(wasLogged).toBe(true);
        });

        // Doesn't actually test that the app is reporting; only that it thinks it is
        // This is a diagnostic anyway. We'll test for state changes elsewhere
        it("enables state-change reporting when that is enabled in config", function () {
            inject(function(appStart, config){
                expect(appStart.reportStateChangesEnabled && config.reportStateChanges).toBe(true);
            });
        });

    });

    describe("when calling toastr", function () {
        var msg = 'some message';
        testFns.spyOnToastr(); // let us know when a toastr method was called
        it("can call error('some message')", function () {
            toastr.error(msg);
            expect(toastr.error).toHaveBeenCalledWith(msg);
        });
        it("can call info('some message')", function () {
            toastr.info(msg);
            expect(toastr.info).toHaveBeenCalledWith(msg);
        });
        it("can call success('some message')", function () {
            toastr.success(msg);
            expect(toastr.success).toHaveBeenCalledWith(msg);
        });
        it("can call warning('some message')", function () {
            toastr.warning(msg);
            expect(toastr.warning).toHaveBeenCalledWith(msg);
        });
    });
});
