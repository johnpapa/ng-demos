(function(auth){
    var expressJwt  = require('express-jwt'),
        jwt         = require('jsonwebtoken'),
        pkg         = require('./package.json');

    var app;
    var apiPath = pkg.paths.api;
    var secret = 'this is the secret secret secret 12356';

    auth.init = init;

    function init(_app_){
        app = _app_;
        app.use(apiPath, expressJwt({secret: secret})); // We are going to protect /api routes with JWT
        handleUnauth();
        configureRoutes();
    }

    function configureRoutes(){
        app.get(apiPath + '/restricted', pingRestricted);
        app.post('/authenticate', postAuth);
    }

    function handleUnauth() {
        app.use(function (err, req, res, next) {
            if (err.constructor.name === 'UnauthorizedError') {
                res.send(401, 'Unauthorized');
            }
        });
    }

    function pingRestricted (req, res, next) {
        console.log('user ' + req.username + ' is calling /api/restricted');
        res.json({
            name: 'ping restricted api'
        });
    }

    function postAuth (req, res) {
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
    }


})(module.exports);
