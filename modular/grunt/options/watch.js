module.exports = {
    html: {
        files: [
            '<%= pkg.paths.webapp %>/**/*.html'
        ],
        options: {
            livereload: true,
            spawn: false
        }
    },
    js: {
        files: [
            '<%= pkg.paths.webapp %>/**/*.js'
        ],
        options: {
            livereload: true,
            spawn: false
        }
    },
    styles: {
        files: [
            '<%= pkg.paths.webroot %>/**/*.css'
        ],
        options: {
            livereload: true,
            spawn: false
        }
    }
};