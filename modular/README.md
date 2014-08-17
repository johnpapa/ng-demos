AngularJS Modular Demo
===========
Demonstrating Angular Modularity

## Structure
- client
- grunt
- server
- test

## Installing Node.js Packages
- Open terminal
- Type `cd server`
- Type `npm install`

## Installing Bower Packages
- Open terminal
- Enter `cd client`
- Type `bower install`

## Running
Runs locally, no database required.
From terminal type `cd server` then type `node server.js` and browse to `http://localhost:7200`

## How It Works
The app is quite simple and has 2 main routes:
- dashboard
- avengers list

### The Modules
The app has 4 feature modules and depends on a series of external modules and custom but cross-app modules

```
app --> [
        app.avengers,
        app.dashboard,
        app.layout,
        app.widgets
    ]
                            -->
                                app.core --> [
                                    ngAnimate,
                                    ngRoute,
                                    ngSanitize,
                                    blocks.exception,
                                    blocks.logger,
                                    blocks.router
                                ]
```

## core Module
Core modules are ones that are shared throughout the entire application and may be customized for the specific application. Example might be common data services.

This is simply put an aggregator of modules that the application will need.

The `core` module takes the blocks, common, and Angular sub-modules as dependencies. All feature specific modules for an application should take a dependency on core, and not the individual blocks that core depends on.

## blocks Modules
Block modules are reusable blocks of code that can be used across projects simply by including them as dependencies.

### blocks.logger Module
The `blocks.logger` module handles logging across the Angular app.

### blocks.exception Module
The `blocks.exception` module handles exceptions across the Angular app.

It depends on the `blocks.logger` module, because the implementation logs the exceptions.

### blocks.router Module
The `blocks.router` module contains a routing helper module that assists in adding routes to the $routeProvider.

## node-inspector

### Quick Start
1. Install globally
    `npm install -g node-inspector`
    
2. Run server, load it in the browser
    `node-debug server/server.js`
    
    This loads http://localhost:8080/debug?port-5858 with the node code in the Chrome debugger

### Manually Run in One Terminal Tab
Run the server with options, and debug
    
    `node --debug=5858 server/server.js & node-inspector`    
Or
    `node-inspector & node --debug server/server.js`

Note: Debug defaults to 5858

### Manual Run and Break on First Line
Run the server and have it break on the first line of code 
    `node-inspector & node --debug-brk server/server.js`

### Run in its own Tab
Or run node-inspector in a separate Terminal tab. You can keep it running and just serve and shutdown your site as needed

### node-inspector with Gulp
Alternative to running node-inspector in its own tab is to use `gulp-shell`

        gulp.src('', {read: false})
            .pipe(plug.shell(['node-inspector']));

Run `gulp serve-dev-debug` or `gulp serve-dev-debug-brk` to debug node via the Gulp tasks in this project.

### Issues 
If a process stays connected find it and kill with these commands
    ```
    lsof -i TCP|fgrep LISTEN
    kill -9 34608
    ```    

