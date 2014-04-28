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

When you open a project with node_modules directory in it, WebStorm will suggest creating a Node.js Dependencies JavaScript library. This action will add these modules to the list of JavaScript libraries used WebStorm for code completion, syntax highlighting, navigation and documentation lookup:

![](/assets/add-node-modules.png)

#Bower
