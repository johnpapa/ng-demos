# =======================================================================================
# Dependencies and constants
# =======================================================================================
logPrefix = '[Cake]:'
SERVER_FILE = 'app'

USER_NAME = 'Max Degterev'
USER_EMAIL = 'me@maxdegterev.name'

VPS_USER = 'maxdegterev'
VPS_HOST = 'maxdegterev.name'
VPS_HOME = '/var/www/maxdegterev'
VPS_LOG = '/var/log/maxdegterev'


{spawn, exec} = require 'child_process'
{print} = require 'sys'


# =======================================================================================
# Utility functions
# =======================================================================================
log = (message)-> console.log("[#{(new Date).toUTCString()}] #{logPrefix} #{message}")
proxyLog = (data)-> print(data.toString())
proxyWarn = (data)-> process.stderr.write(data.toString())

checkNpmVersions = (list)->
  sty = require('sty')

  _checkVersion = (lib, version)->
    exec "npm info #{lib} version", (error, stdout, stderr) ->
      unless error
        latest = stdout.replace('\n\n', '')
        current = version.replace(/[\<\>\=\~]*/, '')

        if current is latest
          console.log("#{sty.bold sty.green 'OK:'} #{lib} #{current}")
        else
          if current is '*'
            console.warn("#{sty.bold sty.cyan 'NOTICE:'} #{lib} version number not specified: #{current}, latest: #{latest}")
          else
            console.warn("#{sty.bold sty.red 'WARN:'} #{lib} needs to be updated, current: #{current}, latest: #{latest}")
      else
        log("Failed to fetch latest version for #{lib}")

  _checkVersion(lib, version) for lib, version of list

checkBowerVersions = (list)->
  sty = require('sty')
  i = 0

  _checkVersion = (lib, version)->
    exec "bower -q info #{lib} version", (error, stdout, stderr) ->
      unless error
        latest = stdout.replace(/\s*/g, '').replace(/\'/g, '')
        current = version.replace(/[\<\>\=\~]*/, '')

        if !!~current.indexOf('git')
          return console.warn("#{sty.bold sty.cyan 'NOTICE:'} using #{lib} with git repo instead of a version number: #{current}")

        if current is latest
          console.log("#{sty.bold sty.green 'OK:'} #{lib} #{current}")
        else
          if current is '*'
            console.warn("#{sty.bold sty.cyan 'NOTICE:'} #{lib} version number not specified: #{current}, latest: #{latest}")
          else
            console.warn("#{sty.bold sty.red 'WARN:'} #{lib} needs to be updated, current: #{current}, latest: #{latest}")
      else
        log("Failed to fetch latest version for #{lib}")

  for lib, version of list
    do (lib, version)->
      setTimeout ->
        _checkVersion(lib, version)
      , i * 10

    i++

npmInstall = (callb)->
  log('Updating npm dependencies')

  runner = exec 'npm install', (error, stdout, stderr) ->
    unless error
      callb?()
    else
      log("Npm dependencies installation failed with an error: #{error}")

  runner.stdout.on('data', proxyLog)
  runner.stderr.on('data', proxyWarn)

bowerInstall = (callb)->
  log('Updating bower dependencies')

  runner = exec 'bower install', (error, stdout, stderr) ->
    unless error
      callb?()
    else
      log("Bower dependencies installation failed with an error: #{error}")

  runner.stdout.on('data', proxyLog)
  runner.stderr.on('data', proxyWarn)

compileGrunt = (callb)->
  log('Executing grunt defaults')

  runner = exec 'grunt', (error, stdout, stderr) ->
    unless error
      callb?()
    else
      log("Grunt defaults failed with an error: #{error}")

  runner.stdout.on('data', proxyLog)
  runner.stderr.on('data', proxyWarn)

buildGrunt = (callb)->
  log('Executing grunt build')

  runner = exec 'grunt build', (error, stdout, stderr) ->
    unless error
      callb?()
    else
      log("Grunt build failed with an error: #{error}")

  runner.stdout.on('data', proxyLog)
  runner.stderr.on('data', proxyWarn)

watchGrunt = ->
  log('Spawning grunt watcher')

  runner = spawn('grunt', ['watch'])
  runner.stdout.on('data', proxyLog)
  runner.stderr.on('data', proxyWarn)

# startDatabase = ->
#   log('Spawning database')

#   runner = spawn('redis-server', ['/usr/local/etc/redis.conf'])
#   runner.stdout.on('data', proxyLog)
#   runner.stderr.on('data', proxyWarn)

startServer = (options = {})->
  unless options.skipwatch
    watchGrunt()
  # startDatabase()

  log('Starting node')

  params = 'NODE_ENV=development NODE_CONFIG_DISABLE_FILE_WATCH=Y'
  unless options.skipwatch
    params += " nodemon -w app/server/ -w app/shared/ -w config/ -w views/server/ -w views/shared/ -w #{SERVER_FILE}.coffee"
  else
    params += ' coffee'
  params += ' --debug' if options.debug
  params += " #{SERVER_FILE}.coffee"

  runner = exec(params)
  runner.stdout.on('data', proxyLog)
  runner.stderr.on('data', proxyWarn)

startProductionServer = ->
  # startDatabase()

  log('Starting node')

  params = "NODE_ENV=production NODE_CONFIG_DISABLE_FILE_WATCH=Y coffee #{SERVER_FILE}.coffee"

  runner = exec(params)
  runner.stdout.on('data', proxyLog)
  runner.stderr.on('data', proxyWarn)

sendMail = (type = 'deploy')->
  mailer = require('nodemailer').createTransport('sendmail')
  pkg = require('./package')

  mailOptions =
    from: "\"#{USER_NAME}\" <#{USER_EMAIL}>"
    to: "\"#{USER_NAME}\" <#{USER_EMAIL}>"

  if type is 'deploy'
    mailOptions.subject = 'Your website has been deployed to the server'
    mailOptions.text = "Deploy of #{pkg.description} was successful, v#{pkg.version} @ #{(new Date).toString()}"
  else
    mailOptions.subject = 'Your website has been pushed to the server'
    mailOptions.text = "Push of #{pkg.description} was successful, v#{pkg.version} @ #{(new Date).toString()}"

  mailer.sendMail(mailOptions, (error, status)-> log("Sendmail failed with an error: #{error}") if error)


# =======================================================================================
# Tasks
# =======================================================================================
task 'versions', '[DEV]: Check package.json and bower.json versions state', ->
  pkg = require('./package')
  bwr = require('./bower')
  log('Checking npm and bower module versions')

  for item in ['dependencies', 'devDependencies', 'peerDependencies']
    checkNpmVersions(pkg[item]) if pkg[item]

  for item in ['dependencies', 'devDependencies', 'peerDependencies']
    checkBowerVersions(bwr[item]) if bwr[item]

task 'versions:npm', '[DEV]: Check package.json versions state', ->
  log('Checking npm module versions')
  pkg = require('./package')
  for item in ['dependencies', 'devDependencies', 'peerDependencies']
    checkNpmVersions(pkg[item]) if pkg[item]

task 'versions:bower', '[DEV]: Check bower.json versions state', ->
  log('Checking bower module versions')
  bwr = require('./bower')
  for item in ['dependencies', 'devDependencies', 'peerDependencies']
    checkBowerVersions(bwr[item]) if bwr[item]

task 'install', '[DEV]: Install all dependencies', ->
  npmInstall -> bowerInstall()

task 'grunt', '[DEV]: Watch and compile clientside assets', ->
  watchGrunt()

task 'dev', '[DEV]: Devserver with autoreload', ->
  compileGrunt -> startServer()

task 'debug', '[DEV]: Devserver with autoreload and debugger', ->
  compileGrunt -> startServer(debug: true)

task 'dev:skipwatch', '[DEV]: Devserver without autoreload', ->
  compileGrunt -> startServer(skipwatch: true)

task 'prod', '[DEV]: Fake PRODUCTION environmont for testing', ->
  buildGrunt -> startProductionServer()

task 'deploy', '[LOCAL]: Update PRODUCTION state from the repo and restart the server', ->
  log("Connecting to VPS #{VPS_USER}@#{VPS_HOST} && running deploy:action")
  exec "ssh #{VPS_USER}@#{VPS_HOST} 'cd #{VPS_HOME} && cake deploy:action'",
    (error, stdout, stderr) ->
      unless error
        log('Triggered deploy, wait for email confirmation 👍')
      else
        log("Deploy failed with an error: #{error}")

task 'push', '[LOCAL]: Update PRODUCTION state from the repo without restarting the server', ->
  log("Connecting to VPS #{VPS_USER}@#{VPS_HOST} && running push:action")
  exec "ssh #{VPS_USER}@#{VPS_HOST} 'cd #{VPS_HOME} && cake push:action'",
    (error, stdout, stderr) ->
      unless error
        log('Triggered push, wait for email confirmation 👍')
      else
        log("Push failed with an error: #{error}")

task 'deploy:action', '[PROD]: Update current app state from the repo and restart the server', ->
  log('Pulling updates from the repo')
  exec 'git pull', (error, stdout, stderr) ->
    unless error
      npmInstall ->
        bowerInstall ->
          buildGrunt ->
            log('Restarting forever')
            exec('forever restartall')
            sendMail()

    else
      log("Git pull failed with an error: #{error}")

task 'push:action', '[PROD]: Update current app state from the repo', ->
  log('Pulling updates from the repo')
  exec 'git pull', (error, stdout, stderr) ->
    unless error
      sendMail('push')
    else
      log("Git pull failed with an error: #{error}")

task 'forever', '[PROD]: Start server in PRODUCTION environmont', ->
  server = "NODE_ENV=production NODE_CONFIG_DISABLE_FILE_WATCH=Y" +
    " forever start -l #{VPS_LOG}/#{SERVER_FILE}.log --append" +
    " --minUptime 1000 --spinSleepTime 1000 --sourceDir #{VPS_HOME} -c coffee #{SERVER_FILE}.coffee"

  log("Starting server: #{server}")
  exec(server)
