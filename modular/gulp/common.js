(function (common) {
    var commentWrapper = require('./commentWrapper.js');

    common.createComments = createComments;

    // Create standard comments header for minified files
    function createComments(gutil) {
        var comments = [
            'John Papa',
            'Copyright 2014',
            'MIT License',
            'Compiled on ' + gutil.date('mmm d, yyyy h:MM:ss TT Z')
        ];
        return commentWrapper.wrap(comments);
    }

})(module.exports)