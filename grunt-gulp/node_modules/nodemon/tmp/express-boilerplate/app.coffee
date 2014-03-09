#=========================================================================================
# DEPENDENCIES & CONSTANTS
#=========================================================================================
helpers = require('./app/shared/helpers')
log = helpers.log

cluster = require('cluster')
config = require('config')
express = require('express')


#=========================================================================================
# FORKING
#=========================================================================================
if cluster.isMaster
  for i in [1..config.workers]
    log("Starting worker #{i}")
    cluster.fork()

  cluster.on 'exit', (worker, code, signal) ->
    log("Worker #{worker.process.pid} died")

    unless config.debug
      cluster.fork()
    else
      process.exit()

else


#=========================================================================================
# INIT DB CONNECTION AND INSTANTIATE SERVER
#=========================================================================================
  server = require('./app/server')
  assetsHashMap = require('./public/assets/hashmap.json') unless config.debug

  app = express()


#=========================================================================================
# TEMPLATE GLOBABS
#=========================================================================================
  generateTemplateGlobals = ->
    app.locals.pretty = config.debug
    app.locals.helpers = helpers
    app.locals.env = process.env.NODE_ENV
    app.locals.client_env =
      hostname: config.hostname
      base_url: config.base_url
      debug: config.debug
      ga_id: config.ga_id
      rendered: (new Date).toUTCString()

      version: require('./package').version


#=========================================================================================
# MIDDLEWARE
#=========================================================================================
  _getAsset = (name)->
    if config.debug
      "/assets/#{name}"
    else
      ext = name.split('.').pop()
      baseName = name.replace('.' + ext, '')
      hash = assetsHashMap[name]
      "/assets/#{baseName}.min.#{hash}.#{ext}"

  gruntAssets = (req, res, next)->
    req.app.locals.getAsset = _getAsset
    next()

  setupMiddleware = ->
    app.use(express.static(__dirname + '/public'))
    # app.use(express.bodyParser())

    app.use(gruntAssets)

    unless config.debug
      app.use(express.compress())
      app.use(express.logger('default'))
    else
      app.use(express.errorHandler(dumpExceptions: true, showStack: true))
      app.use(express.logger('dev'))


#=========================================================================================
# START LISTENING FOR CONNECTIONS
#=========================================================================================
  app.enable('trust proxy') # usually sitting behind nginx
  app.disable('x-powered-by')

  app.set('port', config.port)
  app.set('views', __dirname + '/views/server')
  app.set('view engine', 'jade')

  generateTemplateGlobals()
  setupMiddleware()

  # Fire up the server
  app.use(app.router)
  server.use(app)

  if config.debug
    app.listen(app.get('port'), -> log("Server listening on http://#{config.hostname}:#{app.get('port')} (unbound)"))
  else
    if config.ip
      app.listen(app.get('port'), config.ip, -> log("Server listening on http://#{config.hostname}:#{app.get('port')} (bound to ip: #{config.ip})"))
    else
      app.listen(app.get('port'), -> log("Server listening on http://#{config.hostname}:#{app.get('port')} (unbound)"))
