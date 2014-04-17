/**
 * Adds Breeze operation routes to the express() application via 'configureRoutes'
 */
(function(routes){

    var repository = require('./repository' );

    routes.init = configureRoutes;

    /**
     * Configure Express app with get()/post() Breeze route handlers
     * that perform Breeze persistence operations against the MongoDb `zza` database
     *
     * @param app Instance of express() application;
     */
    function configureRoutes(app) {
        app.get( '/breeze/zza/Lookups',     getLookups   ); // demo specialized route
        app.get( '/breeze/zza/Metadata',    getMetadata  );
        app.post('/breeze/zza/SaveChanges', saveChanges  );

        // '/breeze/zza/:resource' must be the last breeze/zza API route
        app.get( '/breeze/zza/:resource',       getQuery);
    }

    function getLookups(req, res, next) {
        repository.getLookups(makeResponseHandler(res, next));
    }

    function getMetadata (req, res, next) {
        next({
            statusCode: 404,
            message: "No metadata from the server; metadata is defined on the client"
        });
    }

    // Generic approach to processing a Breeze client query
    function getQuery(req, res, next) {
        var resourceName  = req.params.resource;
        var query = repository['get'+resourceName.toLowerCase()];

        if ( !!query ) {
            query(req.query, makeResponseHandler(res, next));
        } else {
            next({ // 404 if the request does not map to a registered query
                statusCode: 404,
                message: "Unable to locate query for " + resourceName
            });
        }
    }

    function makeResponseHandler(res, next) {
        // returns a function that handles response from a Breeze Mongo query or save
        return function(err, results) {
            if (err) {
                next(err);
            } else {
                // Prevent browser from caching results of API data requests
                res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                res.setHeader("Content-Type:", "application/json");
                res.send( JSON.stringify(results) );
            }
        }
    }

    function saveChanges( req, res, next ) {
        repository.saveChanges(req.body, makeResponseHandler(res, next));
    }

})(module.exports);
