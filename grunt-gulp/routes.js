var jsonfileservice = require('./jsonfileservice.js');
var datapath = ''; //'/data/';

exports.maa = function(req, res){
    var json = jsonfileservice.getJsonFromFile(datapath + 'maa.json');
    json[0].data.results.forEach(function(character){
        var pos = character.name.indexOf("(MAA)");
        //console.log(character.name.substr(0, pos-1));
        character.name = character.name.substr(0, pos-1);
    })
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
