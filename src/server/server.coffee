fs = require 'fs'
path = require 'path'

server = require('http').createServer (req, response) ->
  filePath = 'deploy/client' + req.url
  if filePath is './'
    filePath = './index.html'
  extname = path.extname filePath
  contentType = 'text/html'
  switch extname
    when '.js' then contentType = 'text/javascript'
    when '.css' then contentType = 'text/css'
  path.exists filePath, (exists) ->
    if exists
      fs.readFile filePath, (err, data) ->
        if err
          response.writeHead 500
          response.end()
        else
          response.writeHead 200, {'Content-Type':contentType}
          response.write data
          response.end()
    else
      response.writeHead 400
      response.end()

server.listen 8080

nowjs = require 'now'
everyone = nowjs.initialize server

playerOne = null
playerTwo = null

nowjs.on 'connect', ->
  console.log "joined: " + @now.name
  if playerOne is null
    playerOne = @user.clientId
    @now.joinGame 0
  else if playerTwo is null
    playerTwo = @user.clientId
    @now.joinGame 1
  
nowjs.on 'disconnect', ->
  console.log "left: " + @now.name
  if @user.clientId is playerOne
    playerOne = null
  else if @user.clientId is playerTwo
    playerTwo = null
