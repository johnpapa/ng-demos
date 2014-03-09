# Opinionated ExpressJS Boilerplate

A good way to start your NodeJS project. Additional flavours available under different branches. Read this awesome [blog post](http://maxdegterev.name/blog/express-boilerplate) that covers what's inside.

P.S. every time someone doesn't star this project, a little koala bear dies somewhere in the woods. Don't be a monster. Star it. Now.

## Usage:
### Downloading and updating
  It's easier to keep your project up to date if you do the following:

  `git remote add parent git@github.com:suprMax/express-boilerplate.git`

  and then you can just:

  `git pull parent master && git push`

### Development:

1. Install node:

  `brew install node`

2. Install dependencies:

  `sudo npm install -g coffee-script nodemon forever bower grunt-cli && cake install`

3. Edit your hosts (optional):

  `vim /private/etc/hosts`

  add at the bottom

  `127.0.0.1 express.dev`

4. Start server:

  `cake dev`

  and navigate your browser to http://express.dev:3000/ or http://localhost:3000/

5. ???

6. PROFIT

### Vendor dependencies management:

`cake install`

### Assets management:

You shouldn't normally care about that, as Cake takes care of it for you.

Compile assets for production:

  `grunt build`

Just clean up previously created mess:

  `grunt clean`

Build assets for development once

  `grunt`

Watch for assets changes

  `grunt watch`

### Deployment:

Make sure you have Cakefile configuration updated, otherwise it won't work.

  `cake deploy`

Just push changes to the server without restarting and recompiling:

  `cake push`
