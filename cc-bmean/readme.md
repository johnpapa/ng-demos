# Code Camper B-MEAN Demo
Code Camper with Breeze, Mongo, Express, Angular, and Node

## Requirements
- MongoDB
- Node.js
- NPM
- Bower

## Setup
1. Unzip `/src/server/data/ngCodeCamper.zip` to expand the Mongo database
2. Run `npm install` (this will run `bower install` for you)

### MongoDB
Install mongo via Home Brew via Mac. Or install on Windows using from [MongoDB web site instructions](http://www.mongodb.org/downloads).

  brew install mongodb

After installing MongoDB, create put your path to your MongoDB location in the file `src\server\data\mongodb.config`. It may look something like this:

```
dbpath=/Users/john/_git/ng-demos/cc-bmean/server/data/ngCodeCamper
```

## Running CC-BMEAN
1. Run the MongoDB `mongod --config server/data/mongodb.config`
2. `gulp serve-dev`
4. Browse to [http://localhost:3001](http://localhost:3001)

# MongoDB and WebStorm

## MongoDB Primer
http://openmymind.net/mongodb.pdf

## Install
http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/

## Permissions
Allow users to read the the database
`sudo chown `id -u` /data/db`

## Install MongoDB Plugin for WebStorm
- Enter `CMD + SHIFT + A`
- Type `plugin`
- Select `Plugins`
- Search for `mongo`
- Install the `Mongo Plugin`

## Configure MongoDb Integration with WebStorm

This creates a menu option under Tools called `Start MongoDB`

- Enter `CMD + SHIFT + A`
- Type `Configure Tools`
- Press `+` to add a new tool
- Name it `Start MongoDB` and give it a description
- Under Options, only check the `Open console`
- Show in `main menu` only
- Under `Tools settings`
	- set the `Program` to `/Users/johnpapa/mongodb/bin/mongod` or `/usr/local/bin/mongod` (where it is located)
	- set `Parameters` to `--config mongodb.config`
	- set  `working directory` to `/Users/johnpapa/mongodb/bin`

### Config
	#logpath=c:\mongodb\log\mongo.log
	dbpath=/Users/johnpapa/mongodb/data
	rest=true

# Configure the Node + Express Server with WebStorm
- Enter `CMD + SHIFT + A`
- Type `Edit Configurations`
- Press `+` to add a new configuration
- Select `node.js`
- Name it `MEAN server` (or whatever)
- Set the working directory to your project such as `/Users/johnpapa/_git/ng-demos/cc-bmean/server`
- Set the JavaScript file to start as the server `server.js`

## Module Structure
Example structure may look like this:

```
app --> [
          app.featureA
          app.featureB
          app.featureC
          app.layout
          app.widgets
        ]  --> app.core --> [
                                common,
                                blocks.logger,
                                blocks.exception,
                                ui-bootstrap,
                                ngRoute,
                                ngAnimate
                            ]
```

### app
The `app` module is the root of the entire application. This would be named more appropriately to reflect the application. Little or no functionality is here other than aggregating all of the app features which are in other module dependencies.

The `app` module depends on feature modules, which use the naming convention `app.*`

### app.* modules
The `app.*` modules are feature areas for the main app. These all depend on `app.core`.

One example may be `app.orders` which may be a feature area for order information int he app. There may also be `app.layout` which contains all the layout logic for the app, such as login, navbars and menus. There may also be app specific widgets in `app.widgets`.

### app.core
The `app.core` module contains all application specific services and shared code that all (or most) features may require. Thus the `app.*` modules depend on `app.core`.

The `app.core` module also serves as an agregator of all generic, common, 3rd party, and angular modules that are shared across the application. These may include common function helpers, reusable blocks such as a logger, ui-bootstrap or kendo integration, and ngRoute (ng* modules).

### common
The `common` module contains code that may be useful to many applications. Generally very small helpers.

### blocks.*
The `blocks.*` modules contains reusable blocks such as logging and exception handling that can be used by any app.

