/*
 * Data repository that accesses the zza mongo database
 * using the breeze-mongodb server-side module to handle clients requests
 * produced by the breeze.dataservice.mongo client-side dataservice adapter
 */
(function(repository){

    var bmongo   = require('breeze-mongodb'),
        database = require('./database');

    addQueries(); //add query functions to the repo

    // add more features
    repository.getLookups  = getLookups;
    repository.getproducts = getProducts;// a specialized query
    repository.saveChanges = saveChanges;

    /**
     * adds query functions to the repo for certain collections
     * in the form of 'getresourcename' (e.g., 'getcustomers')
     * Private to this module
     */
    function addQueries(){
        var collectionNames = [
            'Customer',
            'Order',
            'OrderStatus',
            // Product is handled separately; see getProducts
            'ProductOption',
            'ProductSize'
        ];

        collectionNames.forEach(makeCollectionQueryFor);

        function makeCollectionQueryFor (collectionName) {
            var resourceName = pluralize(collectionName);
            repository['get'+resourceName.toLowerCase()] = function(queryString, next) {
                getDb(function(db){
                    var query  = new bmongo.MongoQuery(queryString);
                    query.execute( db, collectionName, next );
                }, next);
            };
        }
    }

    /**
     * Get the mongodb database instance (db) and call 'callback' with that db.
     * Passes trappable errors along.
     * Private to this module
     *
     * @param callback {function} the query function to execute
     * @param next {function} next(err, results)
     */
    function getDb(callback, next){
        database.getDb(function(err, db){
            if (err) {
                next(err);
            } else {
                try {
                    callback(db); // assume callback knows about 'next'
                } catch (e) {
                    err = new Error('Died in the repository; review server console');
                    err.stack = e.stack;
                    err.innerError = e;
                    next(err);
                }
            }
        });
    }

    /**
     * lookups query whose result is an object with
     * several sets of reference ('lookup') entities
     *
     * @param next {function} next(err, results)
     */
    function getLookups( next) {
        getDb(get, next);
        function get(db){

            var lookupCollectionNames = [
                'OrderStatus',
                'Product',
                'ProductOption',
                'ProductSize'
            ];
            var failed = false;
            var lookups = {};
            var queryCountDown = 0;

            lookupCollectionNames.forEach(getAll);

            function getAll(collectionName) {
                queryCountDown += 1;
                var entityType = collectionName;
                db.collection( collectionName,{strict: true}, collectionCallback );

                function collectionCallback(err, collection) {
                    if (err) {
                        failed = true;
                        err = { statusCode: 404, message: "Unable to locate: " + collectionName, error: err };
                        next(err);
                    } else {
                        if (!failed){
                            collection.find().toArray(findCallback);
                        }
                    }
                }

                function findCallback(err, results) {
                    queryCountDown -= 1;
                    if (failed) {
                      // already failed, forget it
                    } else if (err) {
                        failed = true;
                        next(err);
                    } else {
                        results.forEach(function (r) {
                            r.$type = entityType;    //Todo: explain why we add $type
                        });
                        lookups[collectionName] = results;
                        if (queryCountDown === 0) { // last of the queries
                            next(null, lookups);    // we're done
                        }
                    }
                }
            }
        }
    }

    /**
     * Products query
     * An example of a "special case" query that requires extra manipulation on the server.
     * As implemented, this query _could_ be done as a regular collection query
     * But imagine that it was special, perhaps because you needed to add custom MongoDb filters.
     *
     * @param queryString {string} client's OData query string
     * @param next {function} next(err, results)
     */
    function getProducts(queryString, next) {
        getDb(get, next);
        function get(db){
            var query = new bmongo.MongoQuery(queryString);
            // add your own custom filters to the 'query' here
            // don't have any in this case but shows you where you'd put them
            query.execute(db, "Product", next);
        }
    }

    /**
     * Makes resource name from the collection name
     * resource names are plural (e.g., 'Customers' resource for 'Customer' collection)
     *
     * @param text {string} to pluralize
     * @returns {string}
     */
    function pluralize(text){
        // ridiculously weak English pluralization
        return text + (text[text.length-1]==='s'?'es' : 's');
    }

    /**
     * Breeze change-set save
     * @param saveBundle {object} a json "saveBundle" from a Breeze client
     * @param next {function} next(err, results)
     */
    function saveChanges( saveBundle, next ) {
        getDb(save, next);
        function save(db){
            var saveProcessor = new bmongo.MongoSaveHandler( db, saveBundle, next);
            saveProcessor.beforeSaveEntity   = function () { return true; };
            saveProcessor.beforeSaveEntities = function (callback) { callback();  };
            saveProcessor.save();
        }
    }

})(module.exports);