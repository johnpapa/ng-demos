/**
 * Create references
 */
var gulp = require('gulp');
var glob = require('glob');
var pkg = require('./package.json');
var common = require('./gulp/common.js');

/**
 * Auto load all gulp plugins
 * Load common utilities for gulp
 */
var gulpLoadPlugins = require('gulp-load-plugins');
var plug = gulpLoadPlugins();
var gutil = plug.loadUtils(['colors', 'env', 'log', 'date']);

/**
 * @desc Lint the code
 */
gulp.task('jshint', function () {
    var sources = [].concat(pkg.paths.js, pkg.paths.nodejs);
    return gulp.src(sources)
        .pipe(plug.jshint('./.jshintrc'))
//        .pipe(plug.jshint.reporter('default'));
        .pipe(plug.jshint.reporter('jshint-stylish'));
});


/**
 * @desc Create $templateCache from the html templates
 */
gulp.task('templatecache', function () {
    gulp.src(pkg.paths.htmltemplates)
        .pipe(plug.angularTemplatecache('templates.js', {
            module: 'app.core',
            standalone: false,
            root: 'app/'
        }))
        .pipe(gulp.dest(pkg.paths.dev));
});



/**
 * @desc Add injection code for @ngInject annotations
 */
gulp.task('ngAnnotate', function () {
    gulp.src(pkg.paths.htmltemplates)
        .pipe(plug.ngAnnotate({
            // true helps add where @ngInject is not used. It infers.
            // Doesn't work with resolve, so we must be explicit there
            add: true
        }))
        .pipe(gulp.dest(pkg.paths.dev));
});

/**
 * @desc Minify and bundle the JavaScript
 */
gulp.task('js', ['jshint', 'templatecache'], function () {
    var source = [].concat(pkg.paths.js, pkg.paths.dev + 'templates.js');
    return gulp.src(source)
//        .pipe(plug.size({showFiles: true}))
        .pipe(plug.sourcemaps.init())
        .pipe(plug.concat('all.min.js'))
        // Annotate before uglify so the code get's min'd properly.
        .pipe(plug.ngAnnotate({
            // true helps add where @ngInject is not used. It infers.
            // Doesn't work with resolve, so we must be explicit there
            add: true
        }))
        .pipe(plug.bytediff.start())
        .pipe(plug.uglify({mangle: true}))
        .pipe(plug.bytediff.stop(common.bytediffFormatter))
        .pipe(plug.sourcemaps.write('./'))
        .pipe(gulp.dest(pkg.paths.dev));
//        .pipe(plug.size({showFiles: true}));
});


/**
 * @desc Copy the Vendor JavaScript
 */
gulp.task('vendorjs', function () {
    return gulp.src(pkg.paths.vendorjs)
        .pipe(plug.concat('vendor.min.js'))
        .pipe(plug.bytediff.start())
        .pipe(plug.uglify())
        .pipe(plug.bytediff.stop(common.bytediffFormatter))
        .pipe(gulp.dest(pkg.paths.dev + 'vendor'))
});

/**
 * @desc Minify and bundle the CSS
 */
gulp.task('css', function () {
    return gulp.src(pkg.paths.css)
//        .pipe(plug.size({showFiles: true}))
        .pipe(plug.concat('all.min.css')) // Before bytediff or after
        .pipe(plug.bytediff.start())
        .pipe(plug.minifyCss({}))
        .pipe(plug.bytediff.stop(common.bytediffFormatter))
//        .pipe(plug.concat('all.min.css')) // Before bytediff or after
        .pipe(gulp.dest(pkg.paths.dev + 'content'));
//        .pipe(plug.size({showFiles: true}));
});


/**
 * @desc Minify and bundle the Vendor CSS
 */
gulp.task('vendorcss', function () {
    return gulp.src(pkg.paths.vendorcss)
        .pipe(plug.concat('vendor.min.css'))
        .pipe(plug.bytediff.start())
        .pipe(plug.minifyCss({}))
        .pipe(plug.bytediff.stop(common.bytediffFormatter))
        .pipe(gulp.dest(pkg.paths.dev + 'content'));
});


/**
 * @desc Copy fonts
 */
gulp.task('fonts', function () {
    return gulp.src(pkg.paths.fonts)
        .pipe(gulp.dest(pkg.paths.dev + 'fonts'));
});


/**
 * @desc Compress images
 */
gulp.task('images', function () {
    return gulp.src(pkg.paths.images)
        .pipe(plug.cache(plug.imagemin({optimizationLevel: 3})))
        .pipe(gulp.dest(pkg.paths.dev + 'content/images'));
});


/**
 * @desc Inject all the files into the new index.html
 */
gulp.task('build-stage', 
    ['js', 'vendorjs', 'css', 'vendorcss', 'images', 'fonts'], function () {
    var target = gulp.src('./client/index.html');
    // var vjs = pkg.paths.vendorjs.map(function (path) {
    //     var file = path.split('/').pop();
    //     return pkg.paths.dev + 'vendor/' + file;
    // });
    var vjs = pkg.paths.dev + 'vendor/vendor.min.js';
//    console.log(vjs);
    var sources = {
        css: gulp.src([pkg.paths.dev + 'content/all.min.css'], {read: false}),
        vendorcss: gulp.src([pkg.paths.dev + 'content/vendor.min.css'], {read: false}),
        js: gulp.src([pkg.paths.dev + 'all.min.js']),
        vendorjs: gulp.src(vjs)
    };
    var ignorePath = pkg.paths.dev.substring(1);

    target
        .pipe(plug.inject(sources.vendorcss, {name: 'inject-vendor', ignorePath: ignorePath}))
        .pipe(plug.inject(sources.css, {ignorePath: ignorePath}))
        .pipe(plug.inject(sources.vendorjs, {name: 'inject-vendor', ignorePath: ignorePath}))
        .pipe(plug.inject(sources.js, {ignorePath: ignorePath}))

        .pipe(gulp.dest(pkg.paths.dev))
        .pipe(plug.notify({
            onLast: true,
            message: 'linted, bundled, and images compressed!'
        }));
});

/**
 * @desc Remove all files from the output folder
 */
gulp.task('clean', function () {
    return gulp.src([
            pkg.paths.dev
        ]).pipe(plug.clean({force: true}));
});


/**
 * @desc Watch files and build
 */
gulp.task('watchjs', function () {
    var js = ['gulpfile.js'].concat(pkg.paths.js);
    var jswatcher = gulp.watch(js, ['js', 'vendorjs']);

    jswatcher.on('change', function (event) {
        console.log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    var css = ['gulpfile.js'].concat(pkg.paths.css, pkg.paths.vendorcss);
    var csswatcher = gulp.watch(css, ['css', 'vendorcss']);

    csswatcher.on('change', function (event) {
        console.log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});


/**
 * @desc Run all tests
 */
gulp.task('test', function() {
    var testFiles = [
        'client/test/**.[Ss]pec.js'
    ];
    return gulp.src(testFiles)
        .pipe(plug.karma({
            configFile: pkg.paths.test + '/karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        });
});


/**
 * serve the dev environment
 */
gulp.task('dev', ['jshint', 'test'], function () {
    plug.nodemon({
        script: 'server/server.js',
        delayTime: 1,
        ext: 'html js',
        env: { 'NODE_ENV': 'dev' },
        ignore: ['build/'],
        nodeArgs: ['--debug=9999']
    })
        .on('change', ['jshint', 'test'])
        .on('restart', function () {
            console.log('restarted!');
        });
});


/**
 * serve the staging environment
 */
gulp.task('stage', ['jshint', 'test', 'build-stage'], function () {
    plug.nodemon({
        script: 'server/server.js',
        delayTime: 1,
        ext: 'html js',
        env: { 'NODE_ENV': 'stage' },
        ignore: ['build/'],
        nodeArgs: ['--debug=9999']
    })
        .on('change', ['jshint', 'test', 'build-stage'])
        .on('restart', function () {
            console.log('restarted!');
        });
});
