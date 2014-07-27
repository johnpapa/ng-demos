(function (commentWrapper) {

    commentWrapper.wrap = wrap;

    function wrap(comments) {
        var output = '/*\n';
        comments.forEach(function (line) {
            output = output + '* ' + line + '\n';
        });
        output = output + '*/\n';
        return output;
    }

})(module.exports)