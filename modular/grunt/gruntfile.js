module.exports = function (grunt) {
    'use strict';

    var config = {
        pkg: require('./package.json'),
        env: process.env
    };
    var configLoader = require('./configloader.js');

    // Load all of the options from the options folder
    grunt.util._.extend(config, configLoader.load('./options/'));
    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
//    grunt.loadNpmTasks('grunt-ng-annotate');

    grunt.registerTask('default', ['watch']);
};