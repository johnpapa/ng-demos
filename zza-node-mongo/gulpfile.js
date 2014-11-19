/* jshint node:true, camelcase:false */
var gulp = require('gulp');
var browserSync = require('browser-sync');
var pkg = require('./package.json');
var plug = require('gulp-load-plugins')();

var reload = browserSync.reload;

var colors = plug.util.colors;
var env = plug.util.env;
var log = plug.util.log;
var port = 7999;

gulp.task('help', plug.taskListing);

/**
 * serve the dev environment
 */
gulp.task('serve-dev', function() {
    serve({mode: 'dev'});
    startBrowserSync();
});

function serve(args) {
    var options = {
        script: 'server/server.js',
//        delayTime: 1,
        ext: 'html js',
        env: {
            'NODE_ENV': args.mode,
            'PORT': port
        },
        watch: ['./server/']
    };

    if (args.debug) {
        require('child_process').exec('node-inspector');
        options.nodeArgs = [args.debug + '=5858'];
    }

    log('Starting MongoDB');
    require('child_process').exec('mongod --dbpath db/zza-mongo-database');

    return plug.nodemon(options)
        .on('start', function() {
            //startBrowserSync();
        })
        .on('restart', function() {
            log('restarted browser-sync!');
            setTimeout(function () {
              //  browserSync.reload({stream: false});
            }, 1000);
        });
}

/**
 * Start BrowserSync
 */
function startBrowserSync() {
//    if (browserSync.active) {
//        return;
//    }

    log('Starting BrowserSync on port 3000');
    browserSync({
        proxy: 'localhost:' + port,
        port: 3000,
        files: './client/app/**/*.*',
        ghostMode: { // these are the defaults t,f,t,t
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        logLevel: 'debug',
        logPrefix: 'zza',
        notify: true,
        reloadDelay: 1000
    });
}
