#Zza Node Mongo
The "Zza Node Mongo" sample app is a single page application (SPA) built with Breeze, Angular, Node, and MongoDB.

## Prerequisites
* Node.js >=0.10
* <a href="http://blog.mongodb.org/post/82092813806/mongodb-2-6-our-biggest-release-ever"
  target="_blank" title="MongoDb release 2.6 announcement">MongoDb >= v.2.6</a>

## Install and use

### Extract the database

Extract the Zza application's MongoDB database in *zza-mongo-database.zip* to your MongoDB data directory.

>The default location per MongoDB installation instructions is *C:\data*. Your location may be different.

You only have to install this database once.

### Install dependent node modules

1. Open a command prompt window.

2. Navigate to the *Zza-Node-Mongo* directory.

3. Use npm to install the following three modules:


     npm install mongodb
     npm install express
     npm install breeze-mongodb

Confirm that all of them ran without error (warnings are ok). You can close this window when you're done.

You only install these modules once.

### Start the servers
*Every time you run the application* you must first launch **two** servers: the MongoDB server and the Zza application's node/express server.

1. Open a new command prompt window.

2. Navigate to the *mongodb/bin* directory.

	>The default location per MongoDB installation instructions is *C:\mongodb\bin*. Your location may be different.

3.	Type **mongod** to start MongoDB.

	>Do not close this window. Closing the window will end the MongoDB process.

4.	Open a new command prompt window.

5.	Navigate to the *Zza-Node-Mongo* directory.

6.	Type **node server** to start the Node.js/Express server.
7.
	>Do not close this window. Closing the window will end the Express process.

### Run Zza

Open **localhost:3000** in a web browser to run the Zza application.

## Release 0.8.0
* Initial release.
* Demonstrates fundamental characteristics of a MongoDB app.
* Maintainable w/o any Microsoft assets at all, neither code nor development tools.
* Demonstrates more sophisticated user interaction paradigms than other Breeze samples. (It actually looks like a SPA.)
