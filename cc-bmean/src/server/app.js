/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compress = require('compression');
var cors = require('cors');
var errorHandler = require('./routes/utils/errorHandler')();
var favicon = require('serve-favicon');
var logger = require('morgan');
var port = process.env.PORT || 3001;
var routes;

var environment = process.env.NODE_ENV;
var oneDay = 86400000;
var pkg = require('./../../package.json');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(compress());            // Compress response data with gzip
app.use(logger('dev'));         // logger
app.use(favicon(__dirname + '/favicon.ico'));
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

switch (environment){
    case 'stage':
        console.log('** STAGE **');
        app.use('/', express.static('./build/stage/'));
        break;
    default:
        console.log('** DEV **');
        app.use('/', express.static(pkg.paths.client, { maxAge: oneDay }));
        app.use('/', express.static('./'));
        break;
}

app.listen(port, function () {
    console.log('************************');
    console.log('Code Camper MEAN Server');
    console.log('Listening on port ' + port);
    console.log('\nRemember to first start MongoDb server');
    console.log('************************\n');
    console.log('env = ' + app.get('env') +
        '\nport = ' + port +
        '\n__dirname = ' + __dirname +
        '\nprocess.cwd() = ' + process.cwd());
});
