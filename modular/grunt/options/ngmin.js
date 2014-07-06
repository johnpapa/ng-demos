module.exports = {
    all: {
        files: [
            {
                expand: true,
                cwd: '../app',
                src: ['**/*.js'],
                // Not using right now, but if I was, need to determine where to put them
                dest: '../app_built/',
                ext: '.js'
            }
        ]
    }
};