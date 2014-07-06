module.exports = {
    options: {
        add: true,
        singleQuotes: true,
        src: [
            '../client/app/dashboard/*.js'
        ],
        dest: '../client/app/out',
        transformDest: function(sourcePath) {
            return sourcePath + '/out';
        }
    },
    all: {
        files: {
            'dashboard.out.js': ['../client/app/dashboard/dashboard.js']
        }
    }
};