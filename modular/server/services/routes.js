(function(routes){
    var app;
    var jsonfileservice = require('./jsonfileservice.js'),
        pkg             = require('./../package.json');
    var apiPath = pkg.paths.api;
    var dataPath = pkg.paths.data;

    routes.init = init;

    function init(_app_){
        app = _app_;
        configureRoutes();
    }

    function configureRoutes(){
        app.get(apiPath + '/maa', getMaa);
    }

    function getMaa (req, res, next){
        var json = jsonfileservice.getJsonFromFile(dataPath + 'maa.json');
        json[0].data.results.forEach(function(character){
            var pos = character.name.indexOf("(MAA)");
            //  console.log(character.name.substr(0, pos-1));
            character.name = character.name.substr(0, pos-1);
        })
        res.send(json);
    }
})(module.exports);
