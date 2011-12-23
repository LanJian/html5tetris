(function() {

  window.PlayArea = (function() {

    PlayArea.numCellsHigh = 20;

    PlayArea.numCellsWide = 10;

    PlayArea.pieceTypes = ['i', 'j', 'l', 'o', 's', 't', 'z'];

    function PlayArea(x, y, w, h) {
      var i, j;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.currentPiece = null;
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
      this.clearList = [];
      this.clearing = false;
      this.clearFlash = 0;
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
            return t.dropAndCommit();
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
        }
      });
    };

    PlayArea.prototype.dropAndCommit = function() {
      this.drop();
      this.commit();
      this.clearLines();
      return this.nextPiece();
    };

    PlayArea.prototype.drop = function() {
      while (!this.checkCollision()) {
        this.currentPiece.row++;
      }
      return this.currentPiece.row--;
    };

    PlayArea.prototype.commit = function() {
      var cell, _i, _len, _ref, _results;
      console.log(this.currentPiece.cells);
      _ref = this.currentPiece.cells;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cell = _ref[_i];
        console.log(this.matrix[this.currentPiece.row + cell[0]][this.currentPiece.col + cell[1]]);
        _results.push(this.matrix[this.currentPiece.row + cell[0]][this.currentPiece.col + cell[1]] = 1);
      }
      return _results;
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
      rand = Math.floor(Math.random() * PlayArea.pieceTypes.length);
      return this.currentPiece = new Piece(PlayArea.pieceTypes[rand], this);
    };

    PlayArea.prototype.checkCollision = function() {
      var cell, _i, _len, _ref;
      _ref = this.currentPiece.cells;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cell = _ref[_i];
        if (this.currentPiece.row + cell[0] >= PlayArea.numCellsHigh) return true;
        if (this.currentPiece.col + cell[1] < 0 || this.currentPiece.col + cell[1] >= PlayArea.numCellsWide) {
          return true;
        }
        if (this.matrix[this.currentPiece.row + cell[0]][this.currentPiece.col + cell[1]] === 1) {
          return true;
        }
      }
      return false;
    };

    PlayArea.prototype.update = function() {
      var i, num, _i, _j, _len, _len2, _ref, _ref2;
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
        if (this.downPressed) this.currentPiece.moveDown();
        if (this.leftPressed) this.currentPiece.moveLeft();
        if (this.rightPressed) this.currentPiece.moveRight();
        if (this.rotatePressed) this.currentPiece.rotate();
        return this.currentPiece.update();
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
      return this.currentPiece.draw(ctx);
    };

    return PlayArea;

  })();

}).call(this);
