/**
 * Create references
 */
var gulp = require('gulp');
var glob = require('glob');
var pkg = require('./package.json');
var common = require('./gulp/common.js');

/**
 * Auto load all gulp plugins
 */
var gulpLoadPlugins = require('gulp-load-plugins');
var plug = gulpLoadPlugins();

/**
 * Load common utilities for gulp
 */
var gutil = plug.loadUtils(['colors', 'env', 'log', 'date']);

/**
 * Could use a staging/development switch.
 * Run `gulp --staging`
 */
var type = gutil.env.staging ? 'staging' : 'development';
gutil.log('Building for', gutil.colors.magenta(type));
gutil.beep();

/**
 * Lint the code
 */
gulp.task('jshint', function () {
    var sources = [].concat(pkg.paths.js, pkg.paths.nodejs);
    return gulp.src(sources)
        .pipe(plug.jshint('./.jshintrc'))
//        .pipe(plug.jshint.reporter('default'));
        .pipe(plug.jshint.reporter('jshint-stylish'));
});


/**
 * Create $templateCache from the html templates
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
 * Minify and bundle the JavaScript
 */
gulp.task('js', ['jshint', 'templatecache'], function () {
    var source = [].concat(pkg.paths.js, pkg.paths.dev + 'templates.js');
    return gulp.src(source)
//        .pipe(plug.size({showFiles: true}))
        .pipe(plug.sourcemaps.init())
        .pipe(plug.concat('all.min.js', {newLine: ';'}))
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
 * Copy the Vendor JavaScript
 */
gulp.task('vendorjs', function () {
    var source = [].concat(pkg.paths.vendorjs,
        pkg.paths.vendorjs.map(function (path) {
            return path + '.map';
        }));
    source.push('./bower_components/jquery/dist/jquery.min.map');
    return gulp.src(source)
        .pipe(gulp.dest(pkg.paths.dev + 'vendor'));
});


/**
 * Minify and bundle the CSS
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
 * Minify and bundle the Vendor CSS
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
 * Copy fonts
 */
gulp.task('fonts', function () {
    return gulp.src(pkg.paths.fonts)
        .pipe(gulp.dest(pkg.paths.dev + 'fonts'));
});


/**
 * Compress images
 */
gulp.task('images', function () {
    return gulp.src(pkg.paths.images)
        .pipe(plug.cache(plug.imagemin({optimizationLevel: 3})))
        .pipe(gulp.dest(pkg.paths.dev + 'content/images'));
});


/**
 * Inject all the files into the new index.html
 */
gulp.task('htmlinject', ['js', 'vendorjs', 'css', 'vendorcss', 'images', 'fonts'], function () {
    var target = gulp.src('./client/index.html');
    var vjs = pkg.paths.vendorjs.map(function (path) {
        var file = path.split('/').pop();
        return pkg.paths.dev + 'vendor/' + file;
    });
    console.log(vjs);
    var sources = {
        css: gulp.src([pkg.paths.dev + 'content/all.min.css'], {read: false}),
        vendorcss: gulp.src([pkg.paths.dev + 'content/vendor.min.css'], {read: false}),
        js: gulp.src([pkg.paths.dev + 'all.min.js']),
        vendorjs: gulp.src(vjs)
    };
    var ignorePath = pkg.paths.dev.substring(1);

    target
        /** Can also use the starttag instead of name */
        /**
        .pipe(plug.inject(sources.vendorcss, {starttag: '<!-- inject:vendor:{{ext}} -->', ignorePath: ignorePath}))
        .pipe(plug.inject(sources.css, {ignorePath: ignorePath}))
        .pipe(plug.inject(sources.js, {ignorePath: ignorePath}))
        .pipe(plug.inject(sources.vendorjs, {starttag: '<!-- inject:vendor:{{ext}} -->', ignorePath: ignorePath}))
        */
        .pipe(plug.inject(sources.vendorcss, {name: 'inject-vendor', ignorePath: ignorePath}))
        .pipe(plug.inject(sources.css, {ignorePath: ignorePath}))
        .pipe(plug.inject(sources.js, {ignorePath: ignorePath}))
        .pipe(plug.inject(sources.vendorjs, {name: 'inject-vendor', ignorePath: ignorePath}))

        .pipe(gulp.dest(pkg.paths.dev));
});


/**
 * Bundle the JS, CSS, and compress images.
 * Then copy files to dev and show a toast.
 */
gulp.task('build', ['htmlinject'], function () {
    // Prepare files for dev
    return gulp.src(pkg.paths.dev)
        .pipe(plug.notify({
            onLast: true,
            message: 'linted, bundled, and images compressed!'
        }));
});

/**
 * Remove all files from the output folder
 */
gulp.task('clean', function () {
    return gulp.src([
            pkg.paths.dev
        ]).pipe(plug.clean({force: true}));
});


/**
 * Watch js files
 */
gulp.task('watchjs', function () {
    var js = ['gulpfile.js'].concat(pkg.paths.js);
    var watcher = gulp.watch(js, ['js', 'vendorjs']);

    watcher.on('change', function (event) {
        console.log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});


/**
 * Watch css files
 */
gulp.task('watchcss', function () {
    var css = ['gulpfile.js'].concat(pkg.paths.css, pkg.paths.vendorcss);
    var watcher = gulp.watch(css, ['css', 'vendorcss']);

    watcher.on('change', function (event) {
        console.log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});


/**
 * Watch all files
 */
gulp.task('watch', ['watchcss', 'watchjs'], function () {
});


/**
 * Run all tests
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
gulp.task('dev', function () {
    plug.nodemon({
        script: 'server/server.js',
        ext: 'html js',
        env: { 'NODE_ENV': 'dev' },
        ignore: ['ignored.js'],
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
gulp.task('stage', function () {
    plug.nodemon({
        script: 'server/server.js',
        ext: 'html js',
        env: { 'NODE_ENV': 'stage' },
        ignore: ['ignored.js'],
        nodeArgs: ['--debug=9999']
    })
        .on('change', ['jshint', 'test'])
        .on('restart', function () {
            console.log('restarted!');
        });
});
