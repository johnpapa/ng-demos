module.exports = function (grunt) {
    var config = {
        pkg: require('./package.json'),
//        pkg: grunt.file.readJSON('package.json'),
        env: process.env
    };

    grunt.util._.extend(config, loadConfig('./options/'));
    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ngmin');

    // This replaces all the individual ones
    // once we install load-grunt-tasks.
    // It installs all npm packages in my devDependencies list
    // that begin with "grunt-".
//    require('load-grunt-tasks')(grunt);

    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['jshint', 'clean', 'uglify', 'concat', 'copy']);
};

function loadConfig(path) {
    var glob = require('glob');
    var object = {};
    var key;

    glob.sync('*', {cwd: path}).forEach(function(option) {
        key = option.replace(/\.js$/,'');
        object[key] = require(path + option);
    });

    return object;
}