WebStorm Tips
============

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

Alternatively, install bower globally from the Mac's terminal

## Tell WebStorm About Bower
- `CMD SHIFT A` and type `bower`
- Enter the bower executable's location (e.g. `/usr/local/bin/bower`)

## Install packages via WebStorm
- `CMD SHIFT A` and type `bower`
- Click the `+` sign to add a new bower package
- Search for the package
- Select the package
- Set any options you desire such as `--save-dev`
- Click `install package`

Alternatively, install bower locally from the Mac's terminal (e.g.  `bower install toastr`)

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



