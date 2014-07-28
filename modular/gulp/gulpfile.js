/*
 * Create references
 */
var gulp = require('gulp');
var glob = require('glob');
var pkg = require('./package.json');
var common = require('./common.js');

/************************
 * Auto load all gulp plugins
 ************************/
var gulpLoadPlugins = require("gulp-load-plugins");
var plug = gulpLoadPlugins();

/************************
 * Load common utilities for gulp
 ************************/
var gutil = plug.loadUtils(['colors', 'env', 'log', 'date']);

/************************
 * Could use a staging/development switch.
 * Run `gulp --staging`
 ************************/
var type = gutil.env.staging ? 'staging' : 'development';
gutil.log('Building for', gutil.colors.magenta(type));
gutil.beep();

/************************
 * Lint the code
 ************************/
gulp.task('jshint', function () {
    return gulp.src(pkg.paths.js)
        .pipe(plug.jshint('.jshintrc'))
//        .pipe(plug.jshint.reporter('default'));
        .pipe(plug.jshint.reporter('jshint-stylish'));
});


/************************
 * Create $templateCache from the html templates
 ************************/
gulp.task('templatecache', function () {
    gulp.src(pkg.paths.htmltemplates)
        .pipe(plug.angularTemplatecache('templates.js', {
            module: 'app.core',
            standalone: false,
            root: 'app/'
        }))
        .pipe(gulp.dest(pkg.paths.dev));
});


/************************
 * Minify and bundle the JavaScript
 ************************/
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


/************************
 * Copy the Vendor JavaScript
 ************************/
gulp.task('vendorjs', function () {
    var source = [].concat(pkg.paths.vendorjs,
        pkg.paths.vendorjs.map(function (path) {
            return path + '.map';
        }));
    source.push('../client/components/jquery/dist/jquery.min.map');
//    console.log(source);
    return gulp.src(source)
        .pipe(gulp.dest(pkg.paths.dev + 'vendor'));
});


/************************
 * Minify and bundle the CSS
 ************************/
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


/************************
 * Minify and bundle the Vendor CSS
 ************************/
gulp.task('vendorcss', function () {
    return gulp.src(pkg.paths.vendorcss)
        .pipe(plug.concat('vendor.min.css'))
        .pipe(plug.bytediff.start())
        .pipe(plug.minifyCss({}))
        .pipe(plug.bytediff.stop(common.bytediffFormatter))
        .pipe(gulp.dest(pkg.paths.dev + 'content'));
});


/************************
 * Copy fonts
 ************************/
gulp.task('fonts', function () {
    return gulp.src(pkg.paths.fonts)
        .pipe(gulp.dest(pkg.paths.dev + 'fonts'));
});


/************************
 * Compress images
 ************************/
gulp.task('images', function () {
    return gulp.src(pkg.paths.images)
        .pipe(plug.cache(plug.imagemin({optimizationLevel: 3})))
        .pipe(gulp.dest(pkg.paths.dev + 'content/images'));
});


/************************
 * Inject all the files into the new index.html
 ************************/
gulp.task('htmlinject', ['js', 'vendorjs', 'css', 'vendorcss', 'images', 'fonts'], function () {
    var target = gulp.src('../client/index.html');
    var v = pkg.paths.vendorjssequence.map(function (file) {
        return pkg.paths.dev + 'vendor/' + file;
    });
    var sources = {
        css: gulp.src([pkg.paths.dev + 'content/all.min.css'], {read: false}),
        vendorcss: gulp.src([pkg.paths.dev + 'content/vendor.min.css'], {read: false}),
        js: gulp.src([pkg.paths.dev + 'all.min.js']),
        vendorjs: gulp.src(v)
    };
    var ignorePath = '/../client';

    target
//        .pipe(plug.rename('index.html'))
        .pipe(plug.inject(sources.vendorcss, {starttag: '<!-- inject:vendor:{{ext}} -->', ignorePath: ignorePath}))
        .pipe(plug.inject(sources.css, {ignorePath: ignorePath}))
        .pipe(plug.inject(sources.js, {ignorePath: ignorePath}))
        .pipe(plug.inject(sources.vendorjs, {starttag: '<!-- inject:vendor:{{ext}} -->', ignorePath: ignorePath}))
//        .pipe(gulp.dest('../client/'));
        .pipe(gulp.dest(pkg.paths.dev));
});


/************************
 * Bundle the JS, CSS, and compress images.
 * Then copy files to dev and show a toast.
 ************************/
gulp.task('default', ['htmlinject'], function () {
    // Prepare files for dev
    return gulp.src(pkg.paths.dev)
        .pipe(plug.notify({
            onLast: true,
            message: "linted, bundled, and images compressed!"
        }));
});


/************************
 * Bundle the JS, CSS, and compress images.
 * Then copy files to staging and show a toast.
 ************************/
gulp.task('stage', ['default'], function () {
    // Copy the files to staging
    return gulp.src(pkg.paths.dev)
        .pipe(gulp.dest(pkg.paths.stage))
        // Notify we are done
        .pipe(plug.notify({
            onLast: true,
            message: "staged!"
        }));
});

/************************
 * Remove all files from the output folder
 ************************/
gulp.task('cleanOutput', function () {
    return gulp.src([
        pkg.paths.dev,
        pkg.paths.stage
    ])
        .pipe(plug.clean({force: true}));
});


/************************
 * Watch js files
 ************************/
gulp.task('watchjs', function () {
    var js = ['gulpfile.js'].concat(pkg.paths.js);
    var watcher = gulp.watch(js, ['js', 'vendorjs']);

    watcher.on('change', function (event) {
        console.log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});


/************************
 * Watch css files
 ************************/
gulp.task('watchcss', function () {
    var css = ['gulpfile.js'].concat(pkg.paths.css, pkg.paths.vendorcss);
    var watcher = gulp.watch(css, ['css', 'vendorcss']);

    watcher.on('change', function (event) {
        console.log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});


/************************
 * Watch all files
 ************************/
gulp.task('watch', ['watchcss', 'watchjs'], function () {
});