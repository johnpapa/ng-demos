/* Mongo + Express + Angular + Node (MEAN)
 *
 *  Assumes the MongoDb server is running.
 *  Browse to app on PORT 3001.
 */

var express      = require('express'),
    app          = express(),
    bodyParser   = require('body-parser'),
    compress     = require('compression'),
    cors         = require('cors'),
    errorHandler = require('./services/errorHandler'),
    favicon      = require('serve-favicon'),
    fileServer   = require('serve-static'),
    http         = require('http'),
    isDev        = app.get('env') === 'development',
    logger       = require('morgan'),
    port         = process.env['PORT'] || 3001,
    routes       = require('./services/routes');

var appDir =  __dirname + '/../client'; // Our CC code
var oneDay = 86400000;

app.use(bodyParser());          // body parser, json, and url encoding
app.use(compress());            // Compress response data with gzip
app.use(logger('dev'));         // logger
app.use(favicon(__dirname + '/favicon.ico'));
app.use(fileServer(appDir));    // Support static file content
app.use(cors());                // enable ALL CORS requests
app.use(errorHandler.init);
app.use('/', express.static(appDir, { maxAge: oneDay }));

routes.init(app);

// Purely for testing
if(isDev){
    app.get('/ping', function(req, res, next) {
        console.log(req.body);
        res.send('pong');
    });
}

var server = http.createServer(app);

server.listen(port, function(){
    console.log('************************');
    console.log('Code Camper MEAN Server');
    console.log('Listening on port ' + port);
    console.log('\nRemember to first start MongoDb server');
    console.log('************************\n');
    console.log('env = '+ app.get('env') +
        '\nport = ' + port  +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd() = '+ process.cwd() +
        '\nappDir = ' + appDir);
});
