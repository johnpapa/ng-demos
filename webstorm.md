WebStorm Tips
============

## Set your keymap
- Go to `settings`
- Click on `keymap`
- Use drop down to select `Mac OS X 10.5+`

#Node.js
Manually install node.js and configure WebStorm to use it.

##Download Node.js
[Node.js download page](http://nodejs.org/download/)

##Tell WebStorm Where to Find Node.js
- `CMD + SHIFT + A` and type `node`. 
- Select `Node.js and NPM`
- Set the `node interpreter` to the node path. (e.g. `/usr/local/bin/node`)

## Enable Node Code Completion
- Go to `Settings`
- `JavaScript`
-  `Libraries` 
-  Check both `Node.js Globals` and `Node.js Core Modules libraries` 

![](/assets/enabled-js-libraries.png)

When you open a project with node_modules directory in it, WebStorm will suggest creating a Node.js Dependencies JavaScript library. This action will add these modules to the list of JavaScript libraries used WebStorm for code completion, syntax highlighting, navigation and documentation lookup:

![](/assets/add-node-modules.png)

#JSHint
JSHint support is built into WebStorm. 

## Enabling JSHint
You can enable JSHint by:
- `CMD + SHIFT + A` and type `jshint`  
- Check `enable`

Set the appropriate and desired settings for JSHint in the dialog.

Scroll to the bottom and click the `Set` link in the `Predefined` globals setting. Then enter any globals for node, comma delimited, such as `require, process, __dirname, console`

#Bower

##Install Bower
Use NPM from terminal to install bower globally. 

- `CMD F12` opens the WebStorm terminal
- type `npm install bower -g` to install bower globally
- If you receive access errors, become superuser temporarily
-  * enter `su -1` and enter your system password
- * retry `npm install bower -g` to install bower globally
- * type exit to exit superuser mode

Alternatively, install bower globally from the Mac's terminal

## Tell WebStorm About Bower
- `CMD SHIFT A` and type `bower`
- Enter the bower executable's location (e.g. `/usr/local/bin/bower`)
- Use terminal to create a bower json file (e.g., `bower init`)
- Place that path in bower.json in this same dialog

## Install packages via WebStorm
- `CMD SHIFT A` and type `bower`
- Click the `+` sign to add a new bower package
- Search for the package
- Select the package
- Set any options you desire such as `--save-dev`
- Click `install package`

Alternatively, install using bower locally from the Mac's terminal (e.g.  `bower install toastr`)

##Install NPM Global Packages
Install any globla packages you require. Some examples include:
- bower
- grunt-cli
- gulp
- grunt
- npm

### Installing a Global Package
- `CMD + SHIFT + A` and type `npm`
- Select `Node.js and NPM`
- Click the `+` sign to add a new bower package
- Search for the package
- Select the package
- Set any options you desire such as `--save-dev`
- Click `install package`

![](/assets/npm-global-pkgs.png)

Alternatively, install globally from the Mac's terminal (e.g.  `npm install grunt-cli -g`)

#Presenter Mode
When presenting in WebStorm using Presentation Mode is very helpful. You can select `View` | `Enter Presentation Mode` or set a keyboard shortcut.

## Setting a keyboard shortcut
Creating a keyboard shortcut for Presentation Mode makes it eaier to enter and leave this mode.

- `CMD SHIFT A`
- Type `keyboard shortcuts`
- Replace the search on the right with `presentation`
- Select `Toggle Presentation Mode` and right click it
- Select `Add keybaord shortcut`
- Enter the keystroke(s) (e.g. `CMD SHIFT P`)
- Click `OK`

# AngularJS
AngularJS tips for WebStorm.

##AngularJS File Templates
- Download the [AngularJS file templates](/assets/angularFileTemplateSettings.jar)
- `CMD SHIFT A` and type `import`
- Select `import settings`
- Browse to the file and select it
- Click `OK` and allow the restart of WebStorm, if prompted

### Angular Controller As

```javascript
(function () {
    'use strict';

    var controllerId = 'people';

    angular.module('demoApp')
        .controller(controllerId, ['$scope', people]);

    function people($scope) {
        var vm = this;

        vm.activate = activate;
        vm.title = 'people';

        activate();

        function activate() {
        }
    }
})();
```

### Angular Clasic Controller ($scope)

```javascript
(function () {
    'use strict';

    var controllerId = 'widgets';

    angular.module('demoApp')
        .controller(controllerId, ['$scope', widgets]);

    function widgets($scope) {
        $scope.activate = activate;
        $scope.title = 'widgets';

        activate()

        function activate() {
        }
    }
})();
```

### Angular Directive

```javascript
(function () {
    'use strict';

    angular.module('demoApp')
        .directive('peopleSearch', ['$window', peopleSearch]);

    function peopleSearch($window) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }
})();
```

### Angular Factory

```javascript
(function () {
    'use strict';

    var serviceId = 'dataservice';

    angular.module('demoApp')
        .factory(serviceId, ['$http', dataservice]);

    function dataservice($http) {
        // TODO: Define the functions and properties to reveal.
        var service = {
            getData: getData
        };

        return service;

        function getData() {
        }
    }
})();
```

### Angular Module

```javascript
(function () {
    'use strict';

    var demoApp = angular.module('demoApp', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute'           // routing

        // Custom modules 

        // 3rd Party Modules

    ]);

    // Execute bootstrapping code and any dependencies.
    demoApp.run(['$rootScope',
        function ($rootScope) {

        }]);
})();
```
# Testing XHR from WebStorm

You can test XHR calls using the REST Client
-  `CMD SHIFT A`
-  Type `RESTful` 
-  Select `Test RESTful Web Service`

Enter a new XHR request in the newly opened dialog

# Trailing Spaces
Strip trailing whitespace at the end of lines when saving a file.

- `CMD SHIFT A` and enter `strip`
- Select `strip trailing spaces on save`
- Scroll down to the `Other` section
- Select when to strip the trailing spaces as `modified lines` or on `all` files

# MongoDB and WebStorm

## MongoDB Primer
http://openmymind.net/mongodb.pdf

## Install
http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/

## Permissions
Allow users to read the the database
`sudo chown `id -u` /data/db`

## Configure MongoDb Integration with WebStorm

This creates a menu option under Tools called `Start MongoDB`

- Enter `CMD + SHIFT + A`
- Type `Configure Tools`
- Press `+` to add a new tool
- Name it `Start MongoDB` and give it a description
- Under Options, only check the `Open console`
- Show in `main menu` only
- Tools settings Program`/Users/papaj015/mongodb/bin/mongod`
- Tools settings Parameters `--config mongodb.config`
- Tools settings working directory `/Users/papaj015/mongodb/bin`
 
### Config
	#logpath=c:\mongodb\log\mongo.log
	dbpath=/Users/papaj015/mongodb/data
	rest=true

# Configure the Node + Express Server with WebStorm
- Enter `CMD + SHIFT + A`
- Type `Edit Configurations`
- Press `+` to add a new configuration
- Select `node.js`
- Name it `MEAN server`
- Set the working directory to your project such as `/Users/papaj015/_git/CC-Angular-Breeze/final/CC.Web`
- Set the JavaScript file to start as the server `mean/server.js`

# Configure the Grunt Build Task with WebStorm
- Enter `CMD + SHIFT + A`
- Type `Edit Configurations`
- Press `+` to add a new configuration
- Select `node.js`
- Name it `Grunt Build`
- Set the working directory to your project such as `/Users/papaj015/_git/CC-Angular-Breeze/final/build`
- Set the JavaScript file to `/usr/local/lib/node_modules/grunt-cli/bin/grunt`
- Set Application Parameters to the name of the grunt task such as `build`

# Installing the AngularJS plugin for Webstorm
(only applicable to WebStorm 7, as this is built into WebStorm 8)

- Navigate to File->Settings->Plugins
- Click "Browse Repositories"
- Select "AngularJS"
- Double-click (or right-click) and, when prompted, choose "Yes"
- Restart WebStorm

