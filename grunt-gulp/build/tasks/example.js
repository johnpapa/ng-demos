module.exports = function(grunt) {
    grunt.registerTask('helloWorld', 'Say hello!', function() {
        grunt.log.writeln("Hello world!");
    });
};