helpers = require('../shared/helpers')
config = require('config')

class Server
  logPrefix: '[app.server]:'
  log: helpers.log

  router: ->
    @app.get('*', (req, res)-> res.render('layout'))

  use: (@app)->
    @router()
    @log('initialized')

module.exports = new Server()
