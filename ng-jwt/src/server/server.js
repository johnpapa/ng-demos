var express      = require('express'),
    app          = express(),
    bodyParser   = require('body-parser'),
    compress     = require('compression'),
    cors         = require('cors'),
    auth         = require('./auth'),
    errorHandler = require('./errorHandler'),
    favicon      = require('serve-favicon'),
    http         = require('http'),
    isDev        = app.get('env') === 'development',
    logger       = require('morgan'),
    port         = process.env.PORT || 7171,
    routes       = require('./routes');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(compress()); // Compress response data with gzip
app.use(logger('dev')); // logger
//app.use(fileServer(process.cwd())); // Support static file content
app.use(cors());          // enable ALL CORS requests
app.use(errorHandler.init);
console.log('** DEV **');
app.use('/', express.static('./src/client'));
app.use('/', express.static('./'));

auth.init(app);
routes.init(app);

if(isDev){
    app.get('/ping', function(req, res, next) {
        console.log(req.body);
        res.send('pong');
    });
}

var server = http.createServer(app);

server.listen(port, function(){
    console.log('Express server listening on port ' + port);
    console.log('env = '+ app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd() );
});