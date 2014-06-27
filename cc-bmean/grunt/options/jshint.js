    module.exports = {
    dev: {
        src: [
            'Gruntfile.js',
              '<%= pkg.webapp %>/**/*.js'
        ],
        options: {
            jshintrc: '.jshintrc'
        }
    }
};