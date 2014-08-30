/*jshint node:true*/
'use strict';

var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var compress     = require('compression');
var fileServer   = require('serve-static');
//var http         = require('http');
var port         = process.env['PORT'] || 8081;
var server;

var appDir =  __dirname + '../../'; // Our NG code is served from root
var environment = process.env.NODE_ENV;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(compress());            // Compress response data with gzip
app.use(fileServer(appDir));    // Support static file content

console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

app.use('/', express.static('./'));

app.get('/ping', function(req, res, next) {
    console.log(req.body);
    res.send('pong');
});

//server = http.createServer(app);

app.listen(port, function(){
    console.log('Express server listening on port ' + port);
    console.log('env = '+ app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd() );
});