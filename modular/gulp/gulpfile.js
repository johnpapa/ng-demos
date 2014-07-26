/*
 * Create references
 */
var gulp = require('gulp');
var pkg = require('./package.json');
var common = require('./common.js');

/*
 * Auto load all gulp plugins
 */
var gulpLoadPlugins = require("gulp-load-plugins");
var plug = gulpLoadPlugins();

/*
 * Load common utilities for gulp
 */
var gutil = plug.loadUtils(['colors', 'env', 'log', 'date']);

/*
 * Create comments for minified files
 */
var commentHeader = common.createComments(gutil);

/*
 * Could use a product/development switch.
 * Run `gulp --production`
 */
var type = gutil.env.production ? 'production' : 'development';
gutil.log( 'Building for', gutil.colors.magenta(type) );
gutil.beep();

/*
 * Lint the code
 */
gulp.task('jshint', function () {
    return gulp.src(pkg.paths.js)
        .pipe(plug.jshint('jshintrc.json'))
//        .pipe(plug.jshint.reporter('default'));
        .pipe(plug.jshint.reporter('jshint-stylish'));
});

/*
 * Minify and bundle the JavaScript
 */
gulp.task('bundlejs', ['jshint'], function () {
    var bundlefile = 'all.min.js';
    var opt = {newLine: ';'};

    return gulp.src(pkg.paths.js)
        .pipe(plug.size({showFiles: true}))
        .pipe(plug.ngAnnotate())
        .pipe(plug.uglify())
        .pipe(plug.concat(bundlefile, opt))
        .pipe(plug.header(commentHeader))
        .pipe(gulp.dest(pkg.paths.dev))
        .pipe(plug.size({showFiles: true}));
});


/*
 * Minify and bundle the CSS
 */
gulp.task('bundlecss', function () {
    return gulp.src(pkg.paths.css)
        .pipe(plug.size({showFiles: true}))
        .pipe(plug.minifyCss({}))
        .pipe(plug.concat('all.min.css'))
        .pipe(plug.header(commentHeader))
        .pipe(gulp.dest(pkg.paths.dev))
        .pipe(plug.size({showFiles: true}));
});

/*
 * Compress images
 */
gulp.task('images', function () {
    return gulp.src(pkg.paths.images)
        .pipe(plug.cache(plug.imagemin({optimizationLevel: 3})))
        .pipe(gulp.dest(pkg.paths.dev));
});



/*
 * One of the cool things about ng-annotate is that if
 * it can’t figure out the injections, you can help with
 * a simple annotation before the function definition:
 *
 */
 // angular.module('app')
 //  .config( /\*@ngInject\*/ function($routeProvider, $locationProvider){
 //       // a-ok
 // });



/*
 * Bundle the JS, CSS, and compress images.
 * Then copy files to production and show a toast.
 */
gulp.task('default', ['bundlejs', 'bundlecss', 'images'], function () {
    // Prepare files for dev
    return gulp.src(pkg.paths.dev)
        .pipe(plug.notify({
            onLast: true,
            message: "linted, bundled, and images compressed!"
        }));
});

gulp.task('stage', ['default'], function () {
    // Copy the files to staging
    return gulp.src(pkg.paths.dev)
        .pipe(gulp.dest(pkg.paths.stage))
        // Notify we are done
        .pipe(plug.notify({
            onLast: true,
            message: "linted, bundled, and images compressed!"
        }));
});

/*
 * Remove all files from the output folder
 */
gulp.task('cleanOutput', function(){
    return gulp.src([
            pkg.paths.dest.base,
            pkg.paths.production])
        .pipe(plug.clean({force: true}))
});
/*
 * Watch file and re-run the linter
 */
gulp.task('build-watcher', function() {
    var jsWatcher = gulp.watch(pkg.paths.js, ['jshint']);

    /*
     * Rebuild when any files changes
     */
//    gulp.watch([pkg.paths.source.css,
//        pkg.paths.source.js,
//        pkg.paths.source.images], ['default']);

    jsWatcher.on('change', function(event) {
        console.log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

