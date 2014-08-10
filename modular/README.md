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

## Testing

[Mocha](http://visionmedia.github.io/mocha/)
[Chai](http://chaijs.com/api/)

