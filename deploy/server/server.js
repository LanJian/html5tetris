(function() {
  var everyone, fs, nowjs, path, playerOne, playerTwo, server;

  fs = require('fs');

  path = require('path');

  server = require('http').createServer(function(req, response) {
    var contentType, extname, filePath;
    filePath = 'deploy/client' + req.url;
    if (filePath === './') filePath = './index.html';
    extname = path.extname(filePath);
    contentType = 'text/html';
    switch (extname) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
    }
    return path.exists(filePath, function(exists) {
      if (exists) {
        return fs.readFile(filePath, function(err, data) {
          if (err) {
            response.writeHead(500);
            return response.end();
          } else {
            response.writeHead(200, {
              'Content-Type': contentType
            });
            response.write(data);
            return response.end();
          }
        });
      } else {
        response.writeHead(400);
        return response.end();
      }
    });
  });

  server.listen(8080);

  nowjs = require('now');

  everyone = nowjs.initialize(server);

  playerOne = null;

  playerTwo = null;

  nowjs.on('connect', function() {
    console.log("joined: " + this.now.name);
    if (playerOne === null) {
      playerOne = this.user.clientId;
      return this.now.joinGame(0);
    } else if (playerTwo === null) {
      playerTwo = this.user.clientId;
      return this.now.joinGame(1);
    }
  });

  nowjs.on('disconnect', function() {
    console.log("left: " + this.now.name);
    if (this.user.clientId === playerOne) {
      return playerOne = null;
    } else if (this.user.clientId === playerTwo) {
      return playerTwo = null;
    }
  });

}).call(this);
