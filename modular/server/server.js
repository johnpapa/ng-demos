/*jshint node:true*/
'use strict';

var express      = require('express'),
    app          = express(),
    bodyParser   = require('body-parser'),
    compress     = require('compression'),
    cors         = require('cors'),
    errorHandler = require('./services/errorHandler'),
    favicon      = require('serve-favicon'),
    fileServer   = require('serve-static'),
    http         = require('http'),
    logger       = require('morgan'),
    port         = process.env['PORT'] || 7200,
    routes       = require('./services/routes');

var environment = process.env.NODE_ENV;
var appDir =  __dirname + '../'; // ./../client'; // Our NG code

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(compress());            // Compress response data with gzip
app.use(logger('dev'));
app.use(favicon(__dirname + '/favicon.ico'));
app.use(fileServer(appDir));    // Support static file content
app.use(cors());                // enable ALL CORS requests
app.use(errorHandler.init);

console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

if(environment === 'stage') {
    console.log('** STAGE **');
    app.use('/', express.static('./build/stage/'));
} else {
    console.log('** DEV **');
//    app.use('/', express.static(appDir));
    app.use('/', express.static('client'));
    app.use('/', express.static('./'));

    app.get('/ping', function(req, res, next) {
        console.log(req.body);
        res.send('pong');
    });
}

routes.init(app);

var server = http.createServer(app);

server.listen(port, function(){
    console.log('Express server listening on port ' + port);
    console.log('env = '+ app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd() );
});