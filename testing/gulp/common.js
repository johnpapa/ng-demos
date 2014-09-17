(function (common) {
    var commentWrapper = require('./commentWrapper.js');

    common.createComments = createComments;
    common.formatPercent = formatPercent;
    common.bytediffFormatter = bytediffFormatter;

    function bytediffFormatter(data) {
        var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
        return data.fileName + ' went from '
            + (data.startSize / 1000).toFixed(2) + ' kB to ' + (data.endSize / 1000).toFixed(2) + ' kB'
            + ' and is ' + common.formatPercent(1-data.percent, 2) + '%' + difference;
    }

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

    function formatPercent(num, precision){
        return (num*100).toFixed(precision);
    }

})(module.exports)