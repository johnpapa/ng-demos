/*
* MongoDb database access
*
* */
var collections = {},
    db,
    mongodb = require('mongodb'),
    mongoDbConfig = {
        dbName: 'ngCodeCamper',
        host: 'localhost',
        port: 27017
    };

// properties with getter functions for export
Object.defineProperty(this, 'db', {
    get: function() { return db; }
});
Object.defineProperty(this, 'collections', {
    get: function() { return collections; }
});

exports.db = this.db;
exports.collections = this.collections;

openMongoDb();

function openMongoDb() {
    /* jshint camelcase:false */
    var dbServer = new mongodb.Server(
        mongoDbConfig.host,
        mongoDbConfig.port,
        { auto_reconnect: true}
    );

    db = new mongodb.Db(mongoDbConfig.dbName, dbServer, {
        strict:true,
        w: 1,
        safe: true
    });

    // Open the DB then get the collections
    db.open(getAllCollections);

    function getAllCollections(){
        // Gets a handle for all of the collections.
        // We do this all at once to save effort later.
        var collectionNames = ['Persons','Rooms','Sessions','TimeSlots','Tracks'];
        var countDown = collectionNames.length;
        collectionNames.forEach(function(name){
            db.collection(name, {strict: true} , function (err, collection) {
                if (err) {
                    console.log('\n!!! Failed while getting MongoDb collections; is the MongoDb server running?');
                    throw new Error( 'Unable to locate collection ' + name + ': ' + err);
                }
                collections[name] = collection;
                countDown -= 1;
                if (countDown === 0){
                    console.log('Retrieved collection handles: '+collectionNames.join(', '));
                }
            });
        });
    }
}