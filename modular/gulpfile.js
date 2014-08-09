/* jshint camelcase:false */
var gulp = require('gulp');
var pkg = require('./package.json');
var common = require('./gulp/common.js');
var plug = require('gulp-load-plugins')();
var env = plug.util.env;
var log = plug.util.log;

gulp.task('help', plug.taskListing);

/**
 * @desc Annotate only
 *  Mostly for show.
 *  See the output of each file?
 *      Uncomment rename, comment concat and uglify
 *  See min'd and concat'd output?
 *      Comment rename, uncomment concat and uglify,
 *      add to index.html, then run it with `gulp serve-dev`.
 */
gulp.task('ngAnnotateTest', function () {
    log('Annotating AngularJS dependencies');
    var source = [].concat(pkg.paths.js);
    return gulp
        // .src(source)
        .src('./client/app/avengers/avengers.js')
        .pipe(plug.ngAnnotate({add: true, single_quotes: true}))
        .pipe(plug.rename(function (path) {
            path.extname = '.annotated.js';
        }))
        // .pipe(plug.concat('all.min.js'))
        // .pipe(plug.uglify({mangle: true}))
        // .pipe(gulp.dest('./client/app'));
        .pipe(gulp.dest('./client/app/avengers'));
});

/**
 * @desc Lint the code
 */
gulp.task('jshint', function () {
    log('Linting the JavaScript');

    var sources = [].concat(pkg.paths.js, pkg.paths.nodejs);
    return gulp
        .src(sources)
        .pipe(plug.jshint('./.jshintrc'))
        .pipe(plug.jshint.reporter('jshint-stylish'));
});

/**
 * @desc Create $templateCache from the html templates
 */
gulp.task('templatecache', function () {
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
 * @desc Minify and bundle the app's JavaScript
 */
gulp.task('js', ['jshint', 'templatecache'], function () {
    log('Bundling, minifying, and copying the app\'s  JavaScript');

    var source = [].concat(pkg.paths.js, pkg.paths.stage + 'templates.js');
    return gulp
        .src(source)
        .pipe(plug.sourcemaps.init())
        .pipe(plug.concat('all.min.js'))
        .pipe(plug.ngAnnotate({add: true, single_quotes: true}))
        .pipe(plug.bytediff.start())
        .pipe(plug.uglify({mangle: true}))
        .pipe(plug.bytediff.stop(common.bytediffFormatter))
        .pipe(plug.sourcemaps.write('./'))
        .pipe(gulp.dest(pkg.paths.stage));
});

/**
 * @desc Copy the Vendor JavaScript
 */
gulp.task('vendorjs', function () {
    log('Bundling, minifying, and copying the Vendor JavaScript');
    return gulp.src(pkg.paths.vendorjs)
        .pipe(plug.concat('vendor.min.js'))
        .pipe(plug.bytediff.start())
        .pipe(plug.uglify())
        .pipe(plug.bytediff.stop(common.bytediffFormatter))
        .pipe(gulp.dest(pkg.paths.stage + 'vendor'));
});

/**
 * @desc Minify and bundle the CSS
 */
gulp.task('css', function () {
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
 * @desc Minify and bundle the Vendor CSS
 */
gulp.task('vendorcss', function () {
    log('Compressing, bundling, compying vendor CSS');
    return gulp.src(pkg.paths.vendorcss)
        .pipe(plug.concat('vendor.min.css'))
        .pipe(plug.bytediff.start())
        .pipe(plug.minifyCss({}))
        .pipe(plug.bytediff.stop(common.bytediffFormatter))
        .pipe(gulp.dest(pkg.paths.stage + 'content'));
});

/**
 * @desc Copy fonts
 */
gulp.task('fonts', function () {
    var dest = pkg.paths.stage + 'fonts';
    log('Copying fonts');
    return gulp
        .src(pkg.paths.fonts)
        .pipe(gulp.dest(dest));
});

/**
 * @desc Compress images
 */
gulp.task('images', function () {
    var dest = pkg.paths.stage + 'content/images';
    log('Compressing, caching, and copying images');
    return gulp
        .src(pkg.paths.images)
        .pipe(plug.cache(plug.imagemin({optimizationLevel: 3})))
        .pipe(gulp.dest(dest));
});

/**
 * @desc Inject all the files into the new index.html
 */
gulp.task('stage',
    ['js', 'vendorjs', 'css', 'vendorcss', 'images', 'fonts', 'test'], function () {
        log('Building index.html to stage');

        return gulp
            .src('./client/index.html')
            .pipe(inject([pkg.paths.stage + 'content/vendor.min.css'], 'inject-vendor'))
            .pipe(inject([pkg.paths.stage + 'content/all.min.css']))
            .pipe(inject(pkg.paths.stage + 'vendor/vendor.min.js', 'inject-vendor'))
            .pipe(inject([pkg.paths.stage + 'all.min.js']))
            .pipe(gulp.dest(pkg.paths.stage))
            .pipe(plug.notify({
                onLast: true,
                message: 'Deployed code to stage!'
            }));

        function inject(glob, name) {
            var ignorePath = pkg.paths.stage.substring(1);
            var options = {ignorePath: ignorePath};
            if (name) {
                options.name = name;
            }
            return plug.inject(gulp.src(glob), options);
        }
    });

/**
 * @desc Remove all files from the build folder
 */
gulp.task('clean', function () {
    log('Cleaning: ' + plug.util.colors.blue(pkg.paths.stage));
    return gulp
        .src(pkg.paths.build, {read: false})
        .pipe(plug.clean({force: true}));
});

/**
 * @desc Watch files and build
 */
gulp.task('watch', function () {
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
 * @desc Run all tests
 */
gulp.task('test', function () {
    log('Running tests');
    var testFiles = [pkg.paths.test + 'spec.mocha/*[Ss]pec.js'];

    return gulp
        .src('./useKarmaConfAndNotThis')
        .pipe(plug.karma({
            configFile: pkg.paths.test + '/karma.conf.js',
            action: 'run' // or watch
        }))
        .on('error', function (err) {
            // failed tests cause gulp to exit
            log(err);
            throw err;
        });
});

/**
 * serve the dev environment
 */
var serveDevTasks = ['jshint', 'test'];
gulp.task('serve-dev', serveDevTasks, function () {
    serve('dev', serveDevTasks);
    startLivereload('development');
});

/**
 * serve the staging environment
 */
var serveStageTasks = ['jshint', 'test', 'stage'];
gulp.task('serve-stage', serveStageTasks, function () {
    serve('stage', serveStageTasks);
    startLivereload('stage');
});

function startLivereload(env) {
    var path = (env === 'stage' ? [pkg.paths.stage, 'client/**'] : ['client/**']);
    var options = {auto: true};
    plug.livereload.listen(options);
    gulp
        .watch(path)
        .on('change', function (file) {
            plug.livereload.changed(file.path);
        });

    log('Serving from ' + env);
}

function serve(env, tasks) {
    plug.nodemon({
        script: 'server/server.js',
        delayTime: 1,
        ext: 'html js',
        env: { 'NODE_ENV': env },
        watch: ['server/', 'client/'],
//        ignore: ['build/'],
        nodeArgs: ['--debug=9999']
    })
        .on('change', tasks)
        .on('restart', function () {
            log('restarted!');
        });
}