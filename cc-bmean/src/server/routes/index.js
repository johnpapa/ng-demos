module.exports = function(app) {
    /**
     * MongoDb server routes for data access
     *
     */
    var dataconfig = require('./../data/dataconfig')();

    var appDir = '';
    var breezeMongo = require('breeze-mongodb');
    var collections = dataconfig.collections;
    var db = dataconfig.db;
    var fs = require('fs');
    var metadata;
    // These are exceptions where we override the routes
    var namedGet = { // keys always all lower case!
        lookups: getLookups,
        metadata: getMetadata,
        speakers: getSpeakers
    };

    setBreezeRoutes();

    function breezeMongoQuery(req, res, next) {
        try {
            var slug = req.params.slug;
            var collectionName = getCollectionNameFrom(slug);
            var moQuery = new breezeMongo.MongoQuery(req.query);
            // could add filters here
            moQuery.execute(db, collectionName, processResults(res, next));
        } catch (ex) {
            var err = {
                statusCode: 404,
                message: 'Unable to execute query " ' + req.url + '"',
                error: ex
            };
            reportError(err, next);
        }
    }

    function get(req, res, next) {
        var slug = req.params.slug; //e.g. sessions
        var slugLc = slug.toLowerCase(); // we only use lower case for named gets
        if (namedGet[slugLc]) {
            namedGet[slugLc](req, res, next);
        } else {
            // assume GET request is a query on a collection
            breezeMongoQuery(req, res, next);
        }
    }

    function getCollectionNameFrom(slug) {
        // extract up to first {\,/,?} and PascalCase it
        var m = slug.match(/(\w)(\w*)([\/\\\?]?)/);
        return m[1].toUpperCase() + (m[2] || '');
    }

    function getLookups(req, res, next) {
        // getLookups is different than a normal 'get' because it
        // gets a bundle of 3 sets of data: rooms, tracks, timeslots.
        var namespace = ':#CC.Model';
        var lookups = {};
        var queryCountDown = 0;
        var done = processResults(res, next);

        getAll('rooms', 'Room', 'Rooms');
        getAll('timeslots', 'TimeSlot', 'TimeSlots');
        getAll('tracks', 'Track', 'Tracks');

        function getAll(lookupName, typeName, collectionName) {
            queryCountDown += 1;
            // Find all items in the collection, and get cursor.
            // Convert them to an array and return the results.
            collections[collectionName].find().toArray(function(err, results) {
                queryCountDown -= 1;
                if (err) {
                    done(err, null);
                    return;
                }
                //Todo: explain why we add $type
                results.forEach(function(r) {
                    r.$type = typeName + namespace;
                });
                lookups[lookupName] = results;

                if (queryCountDown === 0) {
                    done(null, lookups);
                }
            });
        }
    }

    function getMetadata(req, res, next) {
        // getMetadata gets the metadata from a file (we could do by hand).
        if (!metadata) {
            getMetadataFromScriptFile();
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(metadata);

        function getMetadataFromScriptFile() {
            // We have a metadata file already that we generated from the ASP.NET Web API.
            // So let's take advantage of it.
            // We could create by hand, if we were so inclined. Which we are not.
            var filename = appDir + '/test/support/data.metadata.js';
            if (!fs.existsSync(filename)) {
                next(new Error('Unable to locate metadata file: ' + filename));
            }
            var metadataSrc = fs.readFileSync(filename, 'utf8');

            // Depend upon metadata.js in expected form:
            //   begins intro stuff followed by 'metadataVersion'
            //   and ends with '});'
            metadataSrc = '{' + metadataSrc.substring(
                metadataSrc.indexOf('\'metadataVersion\''),
                    metadataSrc.lastIndexOf('}') + 1); // end with last '}'

            // Cleanup the metadata that we got from the Web API client
            var metadataObj = JSON.parse(metadataSrc);
            // We will use different convention.
            // If we don;t remove it, the breeze will use
            // the naming convention in the metadata no matter what
            // we tell it to use in the client (in breeze.config.js).
            delete metadataObj.namingConvention;
            // Remove all dataServices from metadata as the server
            // doesn't need to know about them.
            delete metadataObj.dataServices;

            metadata = JSON.stringify(metadataObj);
        }
    }

    function getSpeakers(req, res, next) {
        // getSpeakers is different than a normal 'get' because it
        // has to find the speakers for all sessions, then get
        // the Person documents for them
        //
        // Get all distinct speakerId's from sessions.
        // Then for each speakerId create a query to find the Person.
        // Collect these and return them.
        collections.Sessions.distinct('speakerId', function(err, speakerIds) {
            if (err) {
                err = {
                    statusCode: 404,
                    message: 'Can\'t get speakerIds from \'Sessions\'',
                    error: err
                };
                reportError(err, next);
            } else {
                var query = new breezeMongo.MongoQuery(req.query);

                // Restrict to persons who have sessions.
                // _id is the Mongo required PK/id.
                // $in is a filter (containing speakerIds)
                var isSpeaker = {_id: {$in: speakerIds}};

                // AND with filter if defined else filter = isSpeaker
                query.filter = req.query.$filter ? {$and: [isSpeaker, query.filter]} : isSpeaker;

                query.execute(db, 'Persons', processResults(res, next));
            }
        });
    }

    function processResults(res, next, description) {
        return function(err, results) {
            if (err) {
                reportError(err, next, description);
            } else {
                sendResults(res, results);
            }
        };
    }

    function reportError(err, next, description) {
        console.log('Request failed:\n' + JSON.stringify(err));
        description = description || 'Request';
        var error = typeof err === 'string' ? {} : err;
        error.statusCode = err.statusCode || 500;
        error.message = err.message || description + ' failed with ' + err;
        error.error = error.error || err;

        next(error);
    }

    /*** Save Changes ***/
    function saveChanges(req, res, next) {
        var saveHandler = new breezeMongo.MongoSaveHandler(db, req.body, processResults(res, next));
        saveHandler.beforeSaveEntity = beforeSaveEntity;
        saveHandler.beforeSaveEntities = beforeSaveEntities;
        saveHandler.save();
    }

    function beforeSaveEntity(entity) {
        /* validation logic here */
        return true;
    }

    function beforeSaveEntities(callback) {
        /* validation logic here */
        callback();
    }

    function sendResults(res, results) {
        // Prevent browser from caching results of API data requests
        // Todo: Is this always the right policy? Never right? Or only for certain resources?
        res.setHeader('Cache-Control',
            'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.setHeader('Content-Type', 'application/json');
        res.send(results);
    }

    function setBreezeRoutes() {
        /* '/breeze/breeze' API routes */
        app.post('/breeze/breeze/SaveChanges', saveChanges);
        app.get('/breeze/breeze/:slug', get); // must be last API route
    }
};
