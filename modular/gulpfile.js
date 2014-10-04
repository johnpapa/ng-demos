/* jshint camelcase:false */
var gulp = require('gulp');
var common = require('./gulp/common.js');
var karma = require('karma').server;
var merge = require('merge-stream');
var pkg = require('./package.json');
var plug = require('gulp-load-plugins')();

var env = plug.util.env;
var log = plug.util.log;

/**
 * List the available gulp tasks
 */
gulp.task('help', plug.taskListing);

/**
 * Lint the code
 * @return {Stream}
 */
gulp.task('analyze', function() {
    log('Analyzing source with JSHint and JSCS');

    var jshintTests = analyzejshint('./src/client/test/**/*.spec.js', './src/client/test/.jshintrc');
    var jshint = analyzejshint([].concat(pkg.paths.js, pkg.paths.nodejs, '!./src/client/test/**/*.spec.js'), './.jshintrc');
    var jscs = analyzejscs([].concat(pkg.paths.js, pkg.paths.nodejs), './.jshintrc');
    return merge(jshintTests, jshint, jscs);
});

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', function() {
    log('Creating an AngularJS $templateCache');

    return gulp
        .src(pkg.paths.htmltemplates)
        .pipe(plug.angularTemplatecache('templates.js', {
            module: 'app.core',
            standalone: false,
            root: 'app/'
        }))
        .pipe(gulp.dest(pkg.paths.stage));
});

/**
 * Minify and bundle the app's JavaScript
 * @return {Stream}
 */
gulp.task('js', ['analyze', 'templatecache'], function() {
    log('Bundling, minifying, and copying the app\'s JavaScript');

    var source = [].concat(pkg.paths.js, pkg.paths.stage + 'templates.js');
    return gulp
        .src(source)
       // .pipe(plug.sourcemaps.init()) // get screwed up in the file rev process
        .pipe(plug.concat('all.min.js'))
        .pipe(plug.ngAnnotate({add: true, single_quotes: true}))
        .pipe(plug.bytediff.start())
        .pipe(plug.uglify({mangle: true}))
        .pipe(plug.bytediff.stop(common.bytediffFormatter))
        // .pipe(plug.sourcemaps.write('./'))
        .pipe(gulp.dest(pkg.paths.stage));
});

/**
 * Copy the Vendor JavaScript
 * @return {Stream}
 */
gulp.task('vendorjs', function() {
    log('Bundling, minifying, and copying the Vendor JavaScript');
    return gulp.src(pkg.paths.vendorjs)
        .pipe(plug.concat('vendor.min.js'))
        .pipe(plug.bytediff.start())
        .pipe(plug.uglify())
        .pipe(plug.bytediff.stop(common.bytediffFormatter))
        .pipe(gulp.dest(pkg.paths.stage)); // + 'vendor'));
});

/**
 * Minify and bundle the CSS
 * @return {Stream}
 */
gulp.task('css', function() {
    log('Bundling, minifying, and copying the app\'s CSS');
    return gulp.src(pkg.paths.css)
        .pipe(plug.concat('all.min.css')) // Before bytediff or after
        .pipe(plug.autoprefixer('last 2 version', '> 5%'))
        .pipe(plug.bytediff.start())
        .pipe(plug.minifyCss({}))
        .pipe(plug.bytediff.stop(common.bytediffFormatter))
//        .pipe(plug.concat('all.min.css')) // Before bytediff or after
        .pipe(gulp.dest(pkg.paths.stage + 'content'));
});

/**
 * Minify and bundle the Vendor CSS
 * @return {Stream}
 */
gulp.task('vendorcss', function() {
    log('Compressing, bundling, copying vendor CSS');
    return gulp.src(pkg.paths.vendorcss)
        .pipe(plug.concat('vendor.min.css'))
        .pipe(plug.bytediff.start())
        .pipe(plug.minifyCss({}))
        .pipe(plug.bytediff.stop(common.bytediffFormatter))
        .pipe(gulp.dest(pkg.paths.stage + 'content'));
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', function() {
    var dest = pkg.paths.stage + 'fonts';
    log('Copying fonts');
    return gulp
        .src(pkg.paths.fonts)
        .pipe(gulp.dest(dest));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', function() {
    var dest = pkg.paths.stage + 'content/images';
    log('Compressing, caching, and copying images');
    return gulp
        .src(pkg.paths.images)
        .pipe(plug.cache(plug.imagemin({optimizationLevel: 3})))
        .pipe(gulp.dest(dest));
});

/**
 * Inject all the files into the new index.html
 * rev, but no map
 * @return {Stream}
 */
gulp.task('rev-and-inject',
    ['js', 'vendorjs', 'css', 'vendorcss'], function() {
        log('Rev\'ing files and building index.html');

        var minified = pkg.paths.stage + '**/*.min.*';
        var index = pkg.paths.client + 'index.html';
        var minFilter = plug.filter(['**/*.min.*', '!**/*.map']);
        var indexFilter = plug.filter(['index.html']);

        var stream = gulp
            // Write the revisioned files
            .src([].concat(minified, index)) // add all staged min files and index.html
            .pipe(minFilter) // filter the stream to minified css and js
            .pipe(plug.rev()) // create files with rev's
            .pipe(gulp.dest(pkg.paths.stage)) // write the rev files
            .pipe(minFilter.restore()) // remove filter, back to original stream

            // inject the files into index.html
            .pipe(indexFilter) // filter to index.html
            .pipe(inject('content/vendor.min.css', 'inject-vendor'))
            .pipe(inject('content/all.min.css'))
            .pipe(inject('vendor.min.js', 'inject-vendor'))
            .pipe(inject('all.min.js'))
            .pipe(gulp.dest(pkg.paths.stage)) // write the rev files
            .pipe(indexFilter.restore()) // remove filter, back to original stream

            // replace the files referenced in index.html with the rev'd files
            .pipe(plug.revReplace())         // Substitute in new filenames
            .pipe(gulp.dest(pkg.paths.stage)) // write the index.html file changes
            .pipe(plug.rev.manifest()) // create the manifest (must happen last or we screw up the injection)
            .pipe(gulp.dest(pkg.paths.stage)); // write the manifest

        function inject(path, name) {
            var glob = pkg.paths.stage + path;
            var options = {
                ignorePath: pkg.paths.stage.substring(1),
                read: false
            };
            if (name) { options.name = name; }
            return plug.inject(gulp.src(glob), options);
        }
    });

/**
 * Stage the optimized app
 * @return {Stream}
 */
gulp.task('stage',
    ['rev-and-inject', 'images', 'fonts'], function() {
        log('Staging the optimized app');

        return gulp.src('').pipe(plug.notify({
            onLast: true,
            message: 'Deployed code to stage!'
        }));
    });

/**
 * Remove all files from the build folder
 * One way to run clean before all tasks is to run
 * from the cmd line: gulp clean && gulp stage
 * @return {Stream}
 */
gulp.task('clean', function() {
    var paths = pkg.paths.build;
    log('Cleaning: ' + plug.util.colors.blue(paths));

    return gulp
        .src(paths, {read: false})
        .pipe(plug.rimraf({force: true}));
});

/**
 * Watch files and build
 * @return {Stream}
 */
gulp.task('watch', function() {
    log('Watching all files');

    var css = ['gulpfile.js'].concat(pkg.paths.css, pkg.paths.vendorcss);
    var images = ['gulpfile.js'].concat(pkg.paths.images);
    var js = ['gulpfile.js'].concat(pkg.paths.js);

    gulp
        .watch(js, ['js', 'vendorjs'])
        .on('change', logWatch);

    gulp
        .watch(css, ['css', 'vendorcss'])
        .on('change', logWatch);

    gulp
        .watch(images, ['images'])
        .on('change', logWatch);

    function logWatch(event) {
        log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
    }
});

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
gulp.task('test', function (done) {
    startTests(true /*singleRun*/, done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *    gulp autotest --startServers  
 * @return {Stream}
 */
gulp.task('autotest', function (done) {
    startTests(false /*singleRun*/, done);
});

/**
 * serve the dev environment, with debug,
 * and with node inspector
 * @return {Stream}
 */
gulp.task('serve-dev-debug', function() {
    serve({mode: 'dev', debug: '--debug'});
    startLivereload('development');
});

/**
 * serve the dev environment, with debug-brk,
 * and with node inspector
 * @return {Stream}
 */
gulp.task('serve-dev-debug-brk', function() {
    serve({mode: 'dev', debug: '--debug-brk'});
    startLivereload('development');
});

/**
 * serve the dev environment
 * @return {Stream}
 */
gulp.task('serve-dev', function() {
    serve({mode: 'dev'});
    startLivereload('development');
});

/**
 * serve the staging environment
 * @return {Stream}
 */
gulp.task('serve-stage', function() {
    serve({mode: 'stage'});
    startLivereload('stage');
});

////////////////

/**
 * Execute JSHint on given source files
 * @param  {Array} sources
 * @param  {string} jshintrc - file
 * @return {Stream}
 */
function analyzejshint(sources, jshintrc) {
    return gulp
        .src(sources)
        .pipe(plug.jshint(jshintrc))
        .pipe(plug.jshint.reporter('jshint-stylish'));
}

/**
 * Execute JSCS on given source files
 * @param  {Array} sources
 * @return {Stream}
 */
function analyzejscs(sources) {
    return gulp
        .src(sources)
        .pipe(plug.jscs('./.jscsrc'));
}

/**
 * Start the node server using nodemon.
 * Optionally start the node debugging.
 * @param  {Object} args - debugging arguments
 * @return {Stream}
 */
function serve(args) {
    var options = {
        script: pkg.paths.server + 'app.js',
        delayTime: 1,
        ext: 'html js',
        env: {'NODE_ENV': args.mode},
        watch: [
            'gulpfile.js',
            'package.json',
            pkg.paths.server,
            pkg.paths.client
        ]
    };

    if (args.debug) {
        gulp.src('', {read: false})
            .pipe(plug.shell(['node-inspector']));
        options.nodeArgs = [args.debug + '=5858'];
    }

    return plug.nodemon(options)
        //.on('change', tasks)
        .on('restart', function() {
            log('restarted!');
        });
}

/**
 * Start Live Reload for a specific environment.
 * @param  {string} mode
 * @return {Steram}
 */
function startLivereload(mode) {
    if (!env.liveReload) { return; }

    log('Serving from ' + mode);
    var path = (env === 'stage' ? [pkg.paths.stage, pkg.paths.client + '/**'] : [pkg.paths.client + '/**']);
    var options = {auto: true};
    plug.livereload.listen(options);
    return gulp.watch(path)
        .on('change', function(file) {
            plug.livereload.changed(file.path);
        });
}

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
    var child;
    var excludeFiles = ['./src/client/app/**/*spaghetti.js'];
    var fork = require('child_process').fork;

    if (env.startServers) {
        log('Starting servers');
        var savedEnv = process.env;
        savedEnv.NODE_ENV = 'dev';
        savedEnv.PORT = 8888;
        child = fork('src/server/app.js', childProcessCompleted);
    } else {
        excludeFiles.push('./src/client/test/midway/**/*.spec.js');
    }

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        exclude: excludeFiles,
        singleRun: !!singleRun
    }, karmaCompleted);

    ////////////////
    function childProcessCompleted(error, stdout, stderr) {
        log('stdout: ' + stdout);
        log('stderr: ' + stderr);
        if (error !== null) {
            log('exec error: ' + error);
        }
    }

    function karmaCompleted() {
        if (child) {child.kill();}
        done();
    }
}

/**
 * Annotate only
 *  ONLY USED IN PLURALSIGHT COURSE ANGULARJS PATTERNS: CLEAN CODE
 *  ONLY FOR DEMO PURPOSES
 *  ALL OTHER TASKS ARE AWESOME-SAUCE
 *
 *  See the output of each file?
 *      Uncomment rename, comment concat and uglify
 *  See min'd and concat'd output?
 *      Comment rename, uncomment concat and uglify,
 *      add to index.html, then run it with `gulp serve-dev`.
 *      
 * @return {Stream}
 */
gulp.task('ngAnnotateTest', function() {
    log('Annotating AngularJS dependencies');
    var source = [].concat(pkg.paths.js);
    return gulp
        .src(pkg.paths.client + '/app/avengers/avengers.js')
        .pipe(plug.ngAnnotate({add: true, single_quotes: true}))
        .pipe(gulp.dest(pkg.paths.client + '/app/avengers/annotated'));
});