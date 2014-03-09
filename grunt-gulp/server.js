var express = require('express');
var routes = require('./routes');
var http = require('http');

var app = express();

// all environments
app.set('port', process.env.PORT || 7070);
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress()); // Compress response data with gzip
app.use(express.json());
app.use(express.static(__dirname));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

// Enable CORS
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/maa', routes.maa);
//app.get('/marvelavengersalliance', routes.marvelavengersalliance);
//app.get('/thor', routes.thor);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
