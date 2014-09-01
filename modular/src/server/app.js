/*jshint node:true*/
'use strict';

var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var compress     = require('compression');
var cors         = require('cors');
var errorHandler = require('./routes/utils/errorHandler')();
var favicon      = require('serve-favicon');
var fileServer   = require('serve-static');
var logger       = require('morgan');
var port         = 7200; //process.env['PORT'] || 7200;
var routes;

var environment = process.env.NODE_ENV;
var pkg = require('./../../package.json');

//process.chdir('./../../');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(compress());            // Compress response data with gzip
app.use(logger('dev'));
app.use(favicon(__dirname + '/favicon.ico'));
app.use(fileServer(__dirname + '/../../'));    // Support static file content
app.use(cors());                // enable ALL CORS requests
app.use(errorHandler.init);

routes = require('./routes/index')(app);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

var source = '';

app.get('/ping', function(req, res, next) {
    console.log(req.body);
    res.send('pong');
});

if(environment === 'stage') {
    console.log('** STAGE **');
    source = './build/stage/';
    app.use('/', express.static(source));
} else {
    console.log('** DEV **');
    source = pkg.paths.client;
    app.use('/', express.static(source));
    app.use('/', express.static('./'));
}

app.listen(port, function(){
    console.log('Express server listening on port ' + port);
    console.log('env = '+ app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd());
});