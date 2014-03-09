module.exports = {
    main: {
        files: [
            // 3rd party scripts
            // Why are we filtering? Why are we flattening?
            {
                cwd: '../',
                src: [
                    '<%= pkg.webroot %>/scripts/*.js',
                    '<%= pkg.webroot %>/scripts/*.map'
                ],
                dest: '<%= pkg.dest %>/',
                expand: true,
                flatten: false,
                filter: 'isFile'
            },
            // Get all Content
            // Why are we filtering? Why are we flattening?
            {
                cwd: '../',
                src: ['<%= pkg.webroot %>/content/**/*.*'],
                dest: '<%= pkg.dest %>',
                expand: true,
                flatten: false,
                filter: 'isFile'
            },
            // Get all the HTML
            {
                cwd: './',
                src: ['<%= pkg.webroot %>/**/*.html'],
                dest: '<%= pkg.dest %>',
                expand: true,
                flatten: false,
                filter: 'isFile'
            }
        ]
    }
};
