# Dependencies
express = require('express')  # <-- Required Package
http = require('http')
path = require('path')

# Application Instance
app = express()

app.set "port", 2000
app.set "view engine" , "jade"

app.use app.router

http.createServer(app).listen app.get('port'), ->
  console.log('Express server listening on port ' + 2000);
