// Karma configuration
// Generated on Sun Jul 13 2014 09:06:13 GMT-0400 (EDT)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',

        // frameworks to use
        // some available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai', 'sinon', 'chai-sinon'],

        // list of files / patterns to load in the browser
        files: [
            './src/client/test/lib/bindPolyfill.js',

            './node_modules/ng-midway-tester/src/ngMidwayTester.js',

            './bower_components/jquery/dist/jquery.js',
            './bower_components/angular/angular.js',
            './bower_components/angular-mocks/angular-mocks.js',
            './bower_components/angular-animate/angular-animate.js',
            './bower_components/angular-route/angular-route.js',
            './bower_components/angular-sanitize/angular-sanitize.js',
            './bower_components/bootstrap/dist/js/bootstrap.js',
            './bower_components/toastr/toastr.js',
            './bower_components/moment/moment.js',
            './bower_components/extras.angular.plus/ngplus-overlay.js',

            './src/client/app/app.module.js',
            './src/client/app/**/*.module.js',
            './src/client/app/**/*.js',

            /* MOCHA */
            './src/client/test/lib/specHelper.js',
            './src/client/test/lib/mockData.js',

            './src/client/test/basics/**/*.src.js',
            './src/client/test/basics/**/*.spec.js',

            // all specs ... comment out during early test training
            './src/client/test/**/*.spec.js'

        ],

        // list of files to exclude
        exclude: [
            // Excluding midway tests for now; comment this line out when you want to run them
            './src/client/test/midway/**/*.spec.js',
            './src/client/app/**/*spaghetti.js'
        ],

        proxies: {
            '/': 'http://localhost:8888/'
        },

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/client/app/**/*.js': 'coverage'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'coverage'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        coverageReporter: {
            type: 'lcov',
            dir: 'test/coverage'
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
//        browsers: ['Chrome', 'ChromeCanary', 'FirefoxAurora', 'Safari', 'PhantomJS'],
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
