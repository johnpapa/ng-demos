module.exports = {
    dev: {
        src: [
            'gruntfile.js',
            '<%= pkg.paths.webapp %>/**/*.js'
        ],
        options: {
            jshintrc: '.jshintrc'
        }
    }
};