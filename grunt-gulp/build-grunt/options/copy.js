module.exports = {
    main: {
        files: [
            // 3rd party scripts
            // Why are we filtering? Why are we flattening?
            {
                cwd: '<%= pkg.webroot %>',
                src: [
                    './scripts/*.js',
                    './scripts/*.map'
                ],
                dest: '<%= pkg.dest %>/',
                expand: true,
                flatten: false,
                filter: 'isFile'
            },
            // Get all Content
            {
                cwd: '<%= pkg.webroot %>',
                src: ['./content/**/*.*'],
                dest: '<%= pkg.dest %>',
                expand: true,
                flatten: false,
                filter: 'isFile'
            },
            // Get all the HTML
            {
                cwd: '<%= pkg.webapp %>',
                src: ['./**/*.html'],
                dest: '<%= pkg.dest %>/app',
                expand: true,
                flatten: false,
                filter: 'isFile'
            }
        ]
    }
};
