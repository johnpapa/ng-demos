/* ngModules.spec.js:
 *
 * ngMocks mocks the module registration so you can get
 * a clean $injector, built from a refreshed Angular Module "cookbook"
 * before each test.
 *
 * You can modify the "cookbook" extensively in one or more `beforeEach()` calls
 * modifying, replacing, or decorating the contents (service, controllers, values, etc).
 *
 * Once you call the ngMocks.inject function, the "cookbook" is frozen.
 * The $injector is built and you may no longer change the "recipes"
 * within the current `describe` or any sub-`describe`. You'll get an error if you try.
 *
 * Although you can replace any module component, you can't mock or prevent
 * Angular from running a module's run or config blocks.
 * That makes run/config block difficult to test; do NOT put anything in them
 * other than calls to module components (e.g.,services) that you can mock.
 *
 * These points are illustrated here.
 *
 * [ A WORK IN PROGRESS ]
 */
describe("Basics - ngModules", function() {

    /*** Fictive Module Arrangement ***/
    /*
     *  test.app      the top-level application module
     *  test.block1   a module with funtionality you can re-use in different apps
     *  test.block2   another such module
     *  test.core     an app module with base functionality shared across app modules
     *  test.feature1 an app feature module
     *  test.feature2 another one
     */

    /* Create modules with nested module dependencies
     *
     *                 tApp
     *                /     \
     *       tFeature1       tFeature2
     *           |    \     /    |
     *           |     tCore     |
     *           |   /           |
      *          |  /            |
     *        tBlock1 <-----> tBlock2
     */
    var tApp = angular.module('test.app', ['test.feature1', 'test.feature2']),

        tFeature1 = angular.module('test.feature1', ['test.core', 'test.block1']),
        tFeature2 = angular.module('test.feature2', ['test.core', 'test.block2']),

        tCore = angular.module('test.core', ['test.block1']),

        // Blocks are mutually dependent. Bad design but we want to see what happens
        tBlock1 = angular.module('test.block1', ['test.block1']),
        tBlock2 = angular.module('test.block2', ['test.block2']);

    // Give them something to do
    tCore
        .value('config', {appTitle: 'Mock Avengers', apiBase: '/api/mma'})
        .factory('dataservice', function (config, voice) {
            return {
                getAvengers: function () {
                    voice.say('Core got Avengers from ' + config.apiBase + '/avengers');
                    return [
                        {name: 'Hulk'},
                        {name: 'Thor'},
                        {name: 'Black Widow'}
                    ];
                }
            };
        });

    tFeature1
        .factory('avenger', function (voice) {
            return {
                avenge: function () {
                    voice.shout();
                }
            };
        });

    tFeature1
        .factory('fixer', function (glueGun) {
            return {
                fix: function (part) {
                    glueGun.glue(part);
                }
            };
        });

    tBlock1
        .factory('voice', function ($log, slogan) {
            return {
                say: function (msg) {
                    $log.log('Block1 said "' + (msg || 'something') + '"');
                },
                shout: function () {
                    $log.log('Block1 shouted "' + slogan + '"');
                }
            };
        });

    tBlock2
        .value('slogan', 'Smash the villains!')
        .factory('glueGun', function (voice) {
            return {
                glue: function (part) {
                    voice.say('Block2 glued ' + part || 'something');
                }
            };
        });

    // Add run blocks
    tApp.run(function (voice) {
        voice.say('tApp running ...')
    });
    tBlock1.run(function (voice) {
        voice.say('tBlock1 running ...')
    });
    tBlock2.run(function (voice) {
        voice.say('tBlock2 running ...')
    });
    tCore.run(function (voice) {
        voice.say('tCore running ...')
    });
    tFeature1.run(function (voice) {
        voice.say('tFeature1 running ...')
    });
    tFeature2.run(function (voice) {
        voice.say('tFeature2 running ...')
    });

    var $log;

    /*** When test.app is not touched ***/
    describe("when untouched", function(){

        beforeEach(module('test.app'));

        // module cookbook closed after this inject
        beforeEach(inject(function(_$log_){
            $log = _$log_;
        }));

        it("starts up", function(){
            printLogs("*** test.app logs at start ***");
        });

        it("shouts when avenging",inject(function (avenger){
            $log.reset();
            avenger.avenge();
            var log = $log.log.logs[0];
            expect(log).to.match(/villain/i, "The log was "+log);
            //printLogs();
        }));
    });



    /*** When test.block2.slogan changed ***/
    describe("when test.block2.slogan changed", function(){
        beforeEach(module('test.app',
            // replace a value somewhere among the test.app modules
            // hint: it's in tBlock2
            function($provide){
                $provide.value('slogan', 'Hey, bad guy, that\'s not nice!');
            }
        ));

        // module cookbook closed after this inject
        beforeEach(inject(function(_$log_){
            $log = _$log_;
        }));

        it("shouts different slogan when avenging",inject(function (avenger){
            $log.reset();
            avenger.avenge();
            var log = $log.log.logs[0];
            expect(log).to.match(/bad guy/i, "The log was "+log);
            //printLogs();
        }));
    });

    //////////
    function printLogs(msg){
        console.log("Basics - ngModules: ");
        var leader = "   ";
        if(msg){ console.log(leader + msg);}
        var logs = $log.log.logs;
        for(var i=0, len = logs.length; i < len; i++) {
            console.log(leader + '['+i+']: '+ logs[i]);
        }
    }

});


