var express      = require('express'),
    app          = express(),
    bodyParser   = require('body-parser'),
    compress     = require('compression'),
    cors         = require('cors'),
//    errorHandler = require('./errorHandler'),
    favicon      = require('static-favicon'),
    fileServer   = require('serve-static'),
    http         = require('http'),
    isDev        = app.get('env') === 'development',
    logger       = require('morgan'),
    port         = process.env["PORT"] || 7070,
    routes       = require('./routes');

//npm install express body-parser compression cors static-favicon serve-static method-override morgan --save-dev

// all environments
app.use(compress()); // Compress response data with gzip
app.use('/', express.static(__dirname));
app.use(logger('dev')); // logger
app.use(bodyParser()); // body parser, json, and url encoding
// Support static file content
app.use( fileServer( process.cwd() ));
app.use(cors());          // enable ALL CORS requests

routes.init(app);

if(isDev){
    app.get('/test', function(req, res, next) {
        console.log(req.body);
        res.send('ping');
    });
}

var server = http.createServer(app);

server.listen(port, function(){
    console.log('Express server listening on port ' + port);
    console.log('env = '+ app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd() );
});