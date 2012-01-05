(function() {

  window.PlayArea = (function() {

    PlayArea.numCellsHigh = 20;

    PlayArea.numCellsWide = 10;

    PlayArea.pieceTypes = ['i', 'j', 'l', 'o', 's', 't', 'z'];

    function PlayArea(x, y, w, h) {
      var i, j, rand;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.currentPiece = null;
      this.ghost = null;
      this.cellWidth = this.w / PlayArea.numCellsWide;
      this.cellHeight = this.h / PlayArea.numCellsHigh;
      this.matrix = (function() {
        var _ref, _results;
        _results = [];
        for (j = 1, _ref = PlayArea.numCellsHigh; 1 <= _ref ? j <= _ref : j >= _ref; 1 <= _ref ? j++ : j--) {
          _results.push((function() {
            var _ref2, _results2;
            _results2 = [];
            for (i = 1, _ref2 = PlayArea.numCellsWide; 1 <= _ref2 ? i <= _ref2 : i >= _ref2; 1 <= _ref2 ? i++ : i--) {
              _results2.push(0);
            }
            return _results2;
          })());
        }
        return _results;
      })();
      this.upKey = 38;
      this.downKey = 40;
      this.leftKey = 37;
      this.rightKey = 39;
      this.rotateKey = 90;
      this.leftPressed = false;
      this.rightPressed = false;
      this.downPressed = false;
      this.rotatePressed = false;
      this.upPressed = false;
      this.playing = true;
      this.clearList = [];
      this.clearing = false;
      this.clearFlash = 0;
      this.downSpeed = 3;
      this.piecesQueue = [];
      for (i = 0; i <= 3; i++) {
        rand = Math.floor(Math.random() * PlayArea.pieceTypes.length);
        this.piecesQueue.push(new Piece(PlayArea.pieceTypes[rand], this));
      }
      this.nextPiece();
    }

    PlayArea.prototype.registerKeys = function(receiver) {
      var t;
      t = this;
      receiver.keydown(function(e) {
        e.preventDefault();
        switch (e.which) {
          case t.leftKey:
            return t.leftPressed = true;
          case t.rightKey:
            return t.rightPressed = true;
          case t.downKey:
            return t.downPressed = true;
          case t.rotateKey:
            return t.rotatePressed = true;
          case t.upKey:
            return t.upPressed = true;
        }
      });
      return receiver.keyup(function(e) {
        e.preventDefault();
        switch (e.which) {
          case t.leftKey:
            return t.leftPressed = false;
          case t.rightKey:
            return t.rightPressed = false;
          case t.downKey:
            return t.downPressed = false;
          case t.rotateKey:
            return t.rotatePressed = false;
          case t.upKey:
            return t.upPressed = false;
        }
      });
    };

    PlayArea.prototype.dropAndCommit = function() {
      this.drop();
      this.commit();
      this.clearLines();
      return this.nextPiece();
    };

    PlayArea.prototype.drop = function(piece) {
      if (piece == null) piece = this.currentPiece;
      while (!this.checkCollision(null, piece)) {
        piece.row++;
      }
      return piece.row--;
    };

    PlayArea.prototype.commit = function() {
      var cell, _i, _len, _ref;
      _ref = this.currentPiece.cells;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cell = _ref[_i];
        if (this.currentPiece.row + cell[0] < 0) {
          this.gameOver();
          return;
        }
        this.matrix[this.currentPiece.row + cell[0]][this.currentPiece.col + cell[1]] = 1;
      }
    };

    PlayArea.prototype.gameOver = function() {
      this.playing = false;
      return console.log('game is over');
    };

    PlayArea.prototype.clearLines = function() {
      var i, _ref;
      for (i = 0, _ref = PlayArea.numCellsHigh - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        if (this.matrix[i].reduce(function(a, b) {
          return a && b;
        })) {
          this.clearList.push(i);
        }
      }
      if (this.clearList.length > 0) return this.clearing = true;
    };

    PlayArea.prototype.collapse = function() {
      var num, row, _i, _len, _ref, _ref2;
      _ref = this.clearList;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        [].splice.apply(this.matrix, [1, row - 1 + 1].concat(_ref2 = this.matrix.slice(0, (row - 1) + 1 || 9e9))), _ref2;
        this.matrix[0] = (function() {
          var _ref3, _results;
          _results = [];
          for (num = 1, _ref3 = PlayArea.numCellsWide; 1 <= _ref3 ? num <= _ref3 : num >= _ref3; 1 <= _ref3 ? num++ : num--) {
            _results.push(0);
          }
          return _results;
        })();
      }
      return this.clearList = [];
    };

    PlayArea.prototype.nextPiece = function() {
      var rand;
      this.piecesQueue.map(function(p) {
        return console.log(p.type);
      });
      this.currentPiece = this.piecesQueue.shift();
      console.log(this.currentPiece.type);
      this.ghost = new Piece('l', this, 'red');
      this.ghost.copy(this.currentPiece);
      this.drop(this.ghost);
      rand = Math.floor(Math.random() * PlayArea.pieceTypes.length);
      return this.piecesQueue.push(new Piece(PlayArea.pieceTypes[rand], this));
    };

    PlayArea.prototype.checkCollision = function(transformation, p) {
      var cell, piece, _i, _len, _ref;
      if (transformation == null) transformation = (function() {});
      if (p == null) p = this.currentPiece;
      piece = $.extend(true, {}, p);
      piece.shape = $.extend(true, {}, p.shape);
      transformation.call(piece);
      _ref = piece.cells;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cell = _ref[_i];
        if (piece.row + cell[0] >= PlayArea.numCellsHigh) return true;
        if (piece.col + cell[1] < 0 || piece.col + cell[1] >= PlayArea.numCellsWide) {
          return true;
        }
        if (piece.row + cell[0] >= 0) {
          if (this.matrix[piece.row + cell[0]][piece.col + cell[1]] === 1) {
            return true;
          }
        }
      }
      return false;
    };

    PlayArea.prototype.update = function() {
      var i, num, _i, _j, _len, _len2, _ref, _ref2;
      if (!this.playing) return;
      if (this.clearing) {
        _ref = this.clearList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          this.matrix[i] = this.matrix[i].map(function(a) {
            return (a + 1) % 2;
          });
        }
        this.clearFlash++;
        if (this.clearFlash >= 8) {
          _ref2 = this.clearList;
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            i = _ref2[_j];
            this.matrix[i] = (function() {
              var _ref3, _results;
              _results = [];
              for (num = 1, _ref3 = PlayArea.numCellsWide; 1 <= _ref3 ? num <= _ref3 : num >= _ref3; 1 <= _ref3 ? num++ : num--) {
                _results.push(0);
              }
              return _results;
            })();
          }
          this.clearing = false;
          this.clearFlash = 0;
          return this.collapse();
        }
      } else {
        if (this.downPressed) this.currentPiece.animateDown();
        if (this.leftPressed && !this.checkCollision(this.currentPiece.left)) {
          this.currentPiece.animateLeft();
        }
        if (this.rightPressed && !this.checkCollision(this.currentPiece.right)) {
          this.currentPiece.animateRight();
        }
        if (this.rotatePressed && !this.checkCollision(this.currentPiece.rotate)) {
          this.currentPiece.animateRotate();
        }
        if (this.upPressed) {
          this.dropAndCommit();
          this.upPressed = false;
        }
        this.currentPiece.animateDown(this.downSpeed);
        if (this.checkCollision(this.currentPiece.down)) {
          this.currentPiece.up();
          this.dropAndCommit();
        }
        this.currentPiece.update();
        this.ghost.copy(this.currentPiece);
        this.drop(this.ghost);
        return this.ghost.updateShape();
      }
    };

    PlayArea.prototype.draw = function(ctx) {
      var i, j, rect, _ref, _ref2;
      rect = new Rect(this.x, this.y, this.w, this.h, '#eeeeee');
      rect.draw(ctx);
      for (i = 0, _ref = this.matrix.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        for (j = 0, _ref2 = this.matrix[1].length - 1; 0 <= _ref2 ? j <= _ref2 : j >= _ref2; 0 <= _ref2 ? j++ : j--) {
          if (this.matrix[i][j] === 1) {
            rect = new Rect(this.x + j * this.cellWidth + 1, this.y + i * this.cellHeight + 1, this.cellWidth - 1, this.cellHeight - 1, 'green');
            rect.draw(ctx);
          }
        }
      }
      this.ghost.draw(ctx);
      return this.currentPiece.draw(ctx);
    };

    return PlayArea;

  })();

}).call(this);
