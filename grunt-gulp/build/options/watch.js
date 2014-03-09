module.exports = {
    scripts: {
        files: [
            '../CC.Web/app/**/*.js',
            'jshintrc.json'
        ],
        tasks: ['jshint'],
        options: {
            spawn: false
        }
    }
};