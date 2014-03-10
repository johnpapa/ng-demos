module.exports = {
    wrap: function (comments){
        var output = '/*\n';
        comments.forEach(function(line){
            output = output + '* ' + line + '\n';
        });
        output = output + '*/\n';
        return output;
    }
}