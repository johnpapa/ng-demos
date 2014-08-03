var gulp = require('gulp');
var glob = require('glob');
var pkg = require('./package.json');
var common = require('./gulp/common.js');
var plug = require('gulp-load-plugins')();

var log = plug.util.log;

/**
 * @desc Lint the code
 */
 gulp.task('jshint', function () {
    log('Linting the JavaScript');

    var sources = [].concat(pkg.paths.js, pkg.paths.nodejs);
    return gulp
        .src(sources)
        .pipe(plug.jshint('./.jshintrc'))
        //.pipe(plug.jshint.reporter('default'));
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
        .pipe(gulp.dest(pkg.paths.dev));
});



/**
 * @desc Add injection code for @ngInject annotations
 */
 gulp.task('ngAnnotate', function () {
    log('Annotating AngularJS dependencies');

    return gulp
        .src(pkg.paths.htmltemplates)
        .pipe(plug.ngAnnotate({
                // true helps add where @ngInject is not used. It infers.
                // Doesn't work with resolve, so we must be explicit there
                add: true
            }))
        .pipe(gulp.dest(pkg.paths.dev));
});

/**
 * @desc Minify and bundle the app's JavaScript
 */
 gulp.task('js', ['jshint', 'templatecache'], function () {
    log('Bundling, minifying, and copying the app\'s  JavaScript');

    var source = [].concat(pkg.paths.js, pkg.paths.dev + 'templates.js');

    return gulp
        .src(source)
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
    log('Bundling, minifying, and copying the Vendor JavaScript');
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
    log('Bundling, minifying, and copying the app\'s CSS');
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
    log('Compressing, bundling, compying vendor CSS');
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
    var dest = pkg.paths.dev + 'fonts';
    log('Copying fonts');
    return gulp
        .src(pkg.paths.fonts)
        .pipe(gulp.dest(dest));
});


/**
 * @desc Compress images
 */
gulp.task('images', function () {
    var dest = pkg.paths.dev + 'content/images';
    log('Compressing, caching, and copying images');
    return gulp
            .src(pkg.paths.images)
            .pipe(plug.cache(plug.imagemin({optimizationLevel: 3})))
            .pipe(gulp.dest(dest));
});


/**
 * @desc Inject all the files into the new index.html
 */
 function buildIndexHtml (){
    log('Building index.html to staging');

    return gulp
        .src('./client/index.html')
        .pipe(inject([pkg.paths.dev + 'content/vendor.min.css'], 'inject-vendor'))
        .pipe(inject([pkg.paths.dev + 'content/all.min.css']))
        .pipe(inject(pkg.paths.dev + 'vendor/vendor.min.js', 'inject-vendor'))
        .pipe(inject([pkg.paths.dev + 'all.min.js']))
        .pipe(gulp.dest(pkg.paths.dev))
        .pipe(plug.notify({
            onLast: true,
            message: 'Deployed code to staging!'
        }));

    function inject(glob, name) {
        var ignorePath = pkg.paths.dev.substring(1);
        var options = {ignorePath: ignorePath};
        if(name) { options.name = name };
        return plug.inject(gulp.src(glob), options)
    }
}

gulp.task('build-stage', 
    ['js', 'vendorjs', 'css', 'vendorcss', 'images', 'fonts'], function () {
        return buildIndexHtml();
    });

/**
 * @desc Remove all files from the output folder
 */
 function clean(path) {
    log('Cleaning: ' + plug.util.colors.blue(path));
    path = path || pkg.paths.dev;
    return cleanPath();

    function cleanPath() {
        return gulp
            .src(path)
            .pipe(plug.clean({force: true}));
    }
}

gulp.task('clean', function () {    
    log('Cleaning: ' + plug.util.colors.blue(path));
    return gulp
        .src(pkg.paths.dev)
        .pipe(plug.clean({force: true}));
});


/**
 * @desc Watch files and build
 */
 gulp.task('watch', function () {
    log('Watching CSS and JavaScript files');

    var css = ['gulpfile.js'].concat(pkg.paths.css, pkg.paths.vendorcss);
    var csswatcher = gulp.watch(css, ['css', 'vendorcss']);
    var js = ['gulpfile.js'].concat(pkg.paths.js);
    var jswatcher = gulp.watch(js, ['js', 'vendorjs']);

    jswatcher.on('change', function (event) {
        console.log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
    });


    csswatcher.on('change', function (event) {
        console.log('*** File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});


/**
 * @desc Run all tests
 */
 gulp.task('test', function() {
    log('Running tests');

    var testFiles = ['client/test/**.[Ss]pec.js'];

    return gulp
        .src(testFiles)
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
    log('Serving from development');

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
    log('Serving from staging');

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
