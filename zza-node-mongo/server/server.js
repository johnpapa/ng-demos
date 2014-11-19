/**
 * Express application server handling all client requests
 *
 * RUN NOTES:
 * -------------------------
 * In this app, the server runs in one directory (server) and the client
 * application's "static content" is served from a different directory (client)
 * because we want to sandbox client access to the client directory and
 * prevent clients from accessing the purely server assets (like server.js).
 *
 * From terminal or console window, you might do the following:
 * > cd <projectDir>/server
 * > node server.js
 *
 * Then open browser to 'localhost:3000'
 *
 */
var express        = require('express')
    , app          = express()
    , bodyParser   = require('body-parser')
    , breezeRoutes = require('./breeze-routes')
    , compress     = require('compression')
    , cors         = require('cors')
    , errorHandler = require('./errorHandler')
    , favicon      = require('static-favicon')
    , fileServer   = require('serve-static')
    , logger       = require('morgan')
    , port         = process.env["PORT"] || 7999;

app.use( favicon());
app.use( logger('dev'));
app.use( compress());
app.use( bodyParser()); // both json & urlencoded

// Support static file content
// Consider 'st' module for caching: https://github.com/isaacs/st
app.use( fileServer( __dirname+'/../client' )); // was fileServer( process.cwd() )

app.use(cors());          // enable ALL CORS requests
breezeRoutes.init( app ); // Configure breeze-specific routes for REST API

// this middleware goes last to catches anything left
// in the pipeline and reports to client as an error
app.use(errorHandler);

// create server (in case interested in socket.io)
app.listen(port, function() {
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd() +
        '\nNode Server is listening on port ' + port);
});
