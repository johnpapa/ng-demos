var commentWrapper = require('./commentWrapper.js');

module.exports = {
// Create standard comments header for minified files
    createComments: function (gutil) {
        var comments = [
            'John Papa',
            'Copyright 2014',
            'MIT License',
            'Compiled on ' + gutil.date('mmm d, yyyy h:MM:ss TT Z')
        ];
        return commentWrapper.wrap(comments);
    }
};
