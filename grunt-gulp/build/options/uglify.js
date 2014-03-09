module.exports = {
    all: {
        files: [
            {
                expand: true,
                cwd: '<%= pkg.webapp %>',
                src: ['**/*.js'],
                dest: '<%= pkg.temp %>',
                ext: '.min.js'
            }
        ]
    }
};