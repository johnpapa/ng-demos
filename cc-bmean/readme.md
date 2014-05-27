# Code Camper B-MEAN Demo
Code Camper with Breeze, Mongo, Express, Angular, and Node

## Requirements
- MongoDB
- Node.js
- NPM
- Bower

## Setup
1. Unzip `\server\data\ngCodeCamper.zip` to expand the Mongo database
2. Enter `bower install` to install the bower packages
3. Go to the `server` folder and enter `npm install` to install the node modules

### MongoDB
After installing MongoDB, create put your path to your MongoDB location in the file `\server\data\mongodb.config`. It may look something like this:

```
dbpath=/Users/johnpapa/_git/ng-demos/cc-bmean/server/data/ngCodeCamper
```

## Running CC-BMEAN
1. Run the MongoDB `mongod --config server/data/mongodb.config`
2. Run the node server by going to `/server` folder 
3. Enter `node server.js`
4. Browse to http://localhost:3000

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
