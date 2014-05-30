module.exports = {
    scripts: {
        files: [
            '../app/**/*.js',
            'jshintrc.json'
        ],
        tasks: ['jshint'],
        options: {
            spawn: false
        }
    }
};