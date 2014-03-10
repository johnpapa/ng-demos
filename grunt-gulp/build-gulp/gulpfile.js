var gulp = require('gulp');
var pkg = require('./package.json');
var common = require('./common.js');

/*
 * Auto load all gulp plugins
 */
var gulpLoadPlugins = require("gulp-load-plugins");
var plug = gulpLoadPlugins();

// Load common utilities for gulp
var gutil = plug.loadUtils(['colors', 'env', 'log', 'date']);

// Create comments for minified files
var commentHeader = common.createComments(gutil);

// Run `gulp --production`
var type = gutil.env.production ? 'production' : 'development';
gutil.log( 'Building for', gutil.colors.magenta(type) );
//gutil.beep();

gulp.task('build-watcher', function() {
    gulp.watch(pkg.paths.source.js, ['bundlejs']);
    gulp.watch(pkg.paths.source.css, ['bundlecss']);
    gulp.watch(pkg.paths.source.images, ['images']);

//    jsWatcher.on('change', function(event) {
//        console.log('File '+event.path+' was '+event.type+', running tasks...');
//    });
});

gulp.task('default', ['bundlejs', 'bundlecss', 'images'], function () {
    // Copy the CSS to prod
    return gulp.src(pkg.paths.dest.css + '/**/*')
        .pipe(gulp.dest(pkg.paths.production + '/content/'))

        // Copy the js files to prod
        .pipe(gulp.src(pkg.paths.dest.js + '/*.js'))
        .pipe(gulp.dest(pkg.paths.production + '/app/'))

        // Notify we are done
        .pipe(plug.notify({
            onLast: true,
            message: "linted, bundled, and images compressed!"
        }));
});

gulp.task('bundlecss', function () {
    return gulp.src(pkg.paths.source.css)
        .pipe(plug.size({showFiles: true}))
        .pipe(plug.minifyCss({}))
        .pipe(plug.concat(pkg.name + ".min.css"))
        .pipe(plug.header(commentHeader))
        .pipe(gulp.dest(pkg.paths.dest.css))
        .pipe(plug.size({showFiles: true}));
});

gulp.task('bundlejs', ['lint'], function () {
    return gulp.src(pkg.paths.source.js)
        .pipe(plug.size({showFiles: true}))
        .pipe(plug.uglify())
        .pipe(plug.concat(pkg.name + ".min.js", {newLine: ';'}))
        .pipe(plug.header(commentHeader))
        .pipe(gulp.dest(pkg.paths.dest.js))
        .pipe(plug.size({showFiles: true}));
});

gulp.task('cleanOutput', function(){
    return gulp.src(pkg.paths.dest.base)
        .pipe(plug.clean({force: true}))
});

gulp.task('images', function () {
    return gulp.src(pkg.paths.source.images)
        .pipe(plug.cache(plug.imagemin({optimizationLevel: 3})))
        .pipe(gulp.dest(pkg.paths.dest.images));
});

gulp.task('lint', function () {
    return gulp.src(pkg.paths.source.js)
        .pipe(plug.jshint('jshintrc.json'))
//        .pipe(plug.jshint.reporter('default'));
        .pipe(plug.jshint.reporter('jshint-stylish'));
});