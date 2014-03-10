module.exports = {
    all: {
        files: [
            {
                expand: true,
                cwd: '../CC.Web/app',
                src: ['**/*.js'],
                // Not using right now, but if I was, need to determine where to put them
                dest: '../CC.Web/app_built/',
                ext: '.js'
            }
        ]
    }
};