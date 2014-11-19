#Zza Node Mongo
The "Zza Node Mongo" sample app is a single page application (SPA) built with Breeze, Angular, Node, and MongoDB.

## Prerequisites
* Node.js >=0.10
* <a href="http://blog.mongodb.org/post/82092813806/mongodb-2-6-our-biggest-release-ever"
  target="_blank" title="MongoDb release 2.6 announcement">MongoDb >= v.2.6</a>

## Install and use

### Extract the database

The *zza-mongo-database.zip* file is the Zza application's MongoDB database. Extract it into the *db* folder. 

You should see three new files in the *db* folder: "zza.0", "zza.1", and "zza.ns"

You only have to do this once.

### Install dependent node modules

1. Open a command/terminal window.

1. Navigate to the *Zza-Node-Mongo* directory.

1. Use npm to install the dependent packages enumerated in the *package.json* file:

     	npm install


1. Confirm that all of them ran without error (warnings are ok). You can close this window when you're done.

You only install these modules once.

### Start the servers
*Every time you run the application* you must first launch **two** servers: the MongoDB server and the Zza application's node/express server.

1. Open a new command prompt window.

1.	Start MongoDB by typing

		mongod --dbpath db	

	This launches the MongoDb server pointing to the folder with the zza database (see db installation above).

	>Do not close this window. Closing the window will end the MongoDB process.

1.	Open a new command/terminal window.

1.	Navigate to the *Zza-Node-Mongo* directory.

1.	Start the app's node/express server by typing

		node server

	>Do not close this window. Closing the window will end the node/express process.

### Run Zza

Open [**localhost:3000**](http://localhost:3000) in a web browser to run the Zza application.

## Release 0.8.0
* Initial release.
* Demonstrates fundamental characteristics of a MongoDB app accessed with Breeze.
* Maintainable w/o any Microsoft assets at all, neither code nor development tools.

