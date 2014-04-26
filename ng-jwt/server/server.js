var express      = require('express'),
    app          = express(),
    bodyParser   = require('body-parser'),
    compress     = require('compression'),
    cors         = require('cors'),
    errorHandler = require('./errorHandler'),
    expressJwt   = require('express-jwt'),
    favicon      = require('static-favicon'),
    fileServer   = require('serve-static'),
    http         = require('http'),
    isDev        = app.get('env') === 'development',
    jwt          = require('jsonwebtoken'),
    logger       = require('morgan'),
    port         = process.env["PORT"] || 7171,
    routes       = require('./routes');

//npm install express body-parser compression cors method-override morgan static-favicon serve-static --save-dev

var appDir =  __dirname + '/../'; // Our NG code
var secret = 'this is the secret secret secret 12356';

// all environments
app.use(compress()); // Compress response data with gzip
app.use('/', express.static(appDir));
// We are going to protect /api routes with JWT
app.use('/api', expressJwt({secret: secret}));
app.use(logger('dev')); // logger
app.use(bodyParser()); // body parser, json, and url encoding
// Support static file content
app.use( fileServer( process.cwd() ));
app.use(cors());          // enable ALL CORS requests

app.use(errorHandler.init);

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