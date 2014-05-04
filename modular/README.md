AngularJS Modular Demo
===========
Demonstrating Angular Modularity

## Installing Node.js Packages
- Open terminal
- Type `cd server`
- Type `npm install`

## Installing Bower Packages
- Open terminal
- Type `bower install`

## Running
Runs locally, no database required.
From terminal type `cd server` then type `node server.js` and browse to `http://localhost:7200`

## How It Works
The app is quite simple and has 2 main routes:
- dashboard
- avengers list

### The Modules
The app has 6 modules and depends on 3 external modules

```
modularApp --> [
        modularApp.avengers,
        modularApp.dashboard,
        modularApp.layout,
        modularApp.widgets
    ]
                            -->
                                modularApp.core --> [
                                    ngAnimate,
                                    ngRoute,
                                    ngSanitize,
                                    common,
                                    common.exceptionHandler
                                ]
```