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
    logger       = require('morgan'),
    port         = process.env["PORT"] || 7171,
    routes       = require('./routes');

var appDir =  __dirname + '/../'; // Our NG code

var secret = 'this is the secret secret secret 12356';

app.use('/api', expressJwt({secret: secret})); // We are going to protect /api routes with JWT

//npm install express body-parser compression cors method-override morgan static-favicon serve-static --save-dev

app.use(bodyParser()); // body parser, json, and url encoding
app.use(compress()); // Compress response data with gzip
app.use(logger('dev')); // logger
app.use(fileServer(process.cwd())); // Support static file content
app.use(cors());          // enable ALL CORS requests
app.use(errorHandler.init);

app.use('/', express.static(appDir));

routes.init(app);

app.use(function (err, req, res, next) {
    if (err.constructor.name === 'UnauthorizedError') {
        res.send(401, 'Unauthorized');
    }
});

app.get('/api/restricted', function(req, res) {
    console.log('user ' + req.username + ' is calling /api/restricted');
    res.json({
        name: 'You made it'
    });
});

app.get('/api/maa', function(req, res) {
    console.log('user is calling /api/maa');
    res.json({
        name: 'You called maa'
    });
});

var jwt = require('jsonwebtoken');
app.post('/authenticate', function(req, res)  {
    //TODO validate req.body.username and req.body.password
    //if is invalid, return 401
    if (!(req.body.username === 'john.papa' && req.body.password === 'secret')) {
        res.send(401, 'Wrong user or password');
        return;
    }

    var profile = {
        firstName: 'John',
        lastName: 'Papa',
        id: 7
    };

    // We are sending the profile inside the token
    var token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });

    res.json({ token: token });
});

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