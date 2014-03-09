var jsonfileservice = require('./jsonfileservice.js');
var datapath = ''; //'/data/';

exports.maa = function(req, res){
    var json = jsonfileservice.getJsonFromFile(datapath + 'maa.json');
    res.send(json);
}

exports.thor = function(req, res){
    var json = jsonfileservice.getJsonFromFile(datapath + 'thor.json');
    res.send(json);
}

exports.marvelAvengersAlliance = function(req, res){
    var json = jsonfileservice.getJsonFromFile(datapath + 'marvelavengersalliance.json');
    res.send(json);
}
