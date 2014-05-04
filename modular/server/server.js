var express      = require('express'),
    app          = express(),
    bodyParser   = require('body-parser'),
    compress     = require('compression'),
    cors         = require('cors'),
    errorHandler = require('./services/errorHandler'),
    favicon      = require('static-favicon'),
    fileServer   = require('serve-static'),
    http         = require('http'),
    isDev        = app.get('env') === 'development',
    logger       = require('morgan'),
    port         = process.env['PORT'] || 7200,
    routes       = require('./services/routes');

var appDir =  __dirname + '/../'; // Our NG code

app.use(bodyParser()); // body parser, json, and url encoding
app.use(compress()); // Compress response data with gzip
app.use(logger('dev')); // logger
app.use(fileServer(process.cwd())); // Support static file content
app.use(cors());          // enable ALL CORS requests
app.use(errorHandler.init);
app.use('/', express.static(appDir));

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