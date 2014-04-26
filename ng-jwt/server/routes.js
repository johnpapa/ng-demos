(function(routes){
    var app;
    var jsonfileservice = require('./jsonfileservice.js');
    var apiPath = '/api';
    var datapath = '/data/';

    routes.init = init;

    function init(_app_){
        app = _app_;
        handleUnauth();
        configureRoutes;
    }

    function configureRoutes(app){
        app.post('/xauthenticate', postAuth);
        app.get(apiPath + '/maa', getMaa);
        app.get(apiPath + '/restricted', getRestricted);
    }

    function handleUnauth() {
        app.use(function (err, req, res, next) {
            if (err.constructor.name === 'UnauthorizedError') {
                res.send(401, 'Unauthorized');
            }
        });
    }

    function getMaa (req, res, next){
        var json = jsonfileservice.getJsonFromFile(datapath + 'maa.json');
        json[0].data.results.forEach(function(character){
            var pos = character.name.indexOf("(MAA)");
            //  console.log(character.name.substr(0, pos-1));
            character.name = character.name.substr(0, pos-1);
        })
        res.send(json);
    }

    function getRestricted (req, res) {
        console.log('user ' + req.user.email + ' is calling /api/restricted');
        res.json({
            name: 'foo'
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
