module.exports = function (grunt) {
    var config = {
        pkg: require('./package.json'),
//        pkg: grunt.file.readJSON('package.json'),
        env: process.env
    };
    var configLoader = require('./configloader.js');

    // Load all of the options from the options folder
    grunt.util._.extend(config, configLoader.load('./options/'));
    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // This replaces all the individual ones
    // once we install load-grunt-tasks.
    // It installs all npm packages in my devDependencies list
    // that begin with "grunt-".
//    require('load-grunt-tasks')(grunt);

    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['jshint', 'clean', 'uglify', 'concat', 'copy']);
};