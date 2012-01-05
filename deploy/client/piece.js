(function() {
  var PieceShape;

  window.Piece = (function() {

    Piece.shapes = {
      i: [[[2, 1], [2, 2], [2, 3], [2, 4]], [[1, 2], [2, 2], [3, 2], [4, 2]], [[2, 0], [2, 1], [2, 2], [2, 3]], [[0, 2], [1, 2], [2, 2], [3, 2]]],
      j: [[[1, 1], [2, 1], [2, 2], [2, 3]], [[1, 2], [1, 3], [2, 2], [3, 2]], [[2, 1], [2, 2], [2, 3], [3, 3]], [[1, 2], [2, 2], [3, 2], [3, 1]]],
      l: [[[1, 3], [2, 1], [2, 2], [2, 3]], [[1, 2], [2, 2], [3, 2], [3, 3]], [[2, 1], [2, 2], [2, 3], [3, 1]], [[1, 1], [1, 2], [2, 2], [3, 2]]],
      o: [[[2, 2], [2, 3], [3, 2], [3, 3]], [[2, 2], [2, 3], [3, 2], [3, 3]], [[2, 2], [2, 3], [3, 2], [3, 3]], [[2, 2], [2, 3], [3, 2], [3, 3]]],
      s: [[[1, 2], [1, 3], [2, 1], [2, 2]], [[1, 2], [2, 2], [2, 3], [3, 3]], [[2, 2], [2, 3], [3, 1], [3, 2]], [[1, 1], [2, 1], [2, 2], [3, 2]]],
      t: [[[2, 1], [2, 2], [2, 3], [3, 2]], [[1, 2], [2, 1], [2, 2], [3, 2]], [[2, 1], [2, 2], [2, 3], [1, 2]], [[1, 2], [2, 2], [2, 3], [3, 2]]],
      z: [[[1, 1], [1, 2], [2, 2], [2, 3]], [[1, 3], [2, 2], [2, 3], [3, 2]], [[2, 1], [2, 2], [3, 2], [3, 3]], [[1, 2], [2, 1], [2, 2], [3, 1]]]
    };

    function Piece(type, playArea, color) {
      var pivot;
      this.type = type;
      this.playArea = playArea;
      this.color = color != null ? color : 'blue';
      this.rotationIndex = 0;
      this.cells = Piece.shapes[this.type][this.rotationIndex];
      this.row = this.type === 't' || this.type === 'o' ? -4 : -3;
      this.col = 2;
      this.rotating = false;
      this.movingLeft = false;
      this.movingRight = false;
      this.rotateSpeed = 0.5;
      this.horizontalSpeed = 10;
      pivot = this.type === 'o' ? 3 : 2.5;
      this.shape = new PieceShape(this.cells, this.col * this.playArea.cellWidth, this.row * this.playArea.cellHeight, this.playArea.cellWidth, this.playArea.cellHeight, 0, pivot, this.color);
    }

    Piece.prototype.animateDown = function(speed) {
      if (speed == null) speed = 8;
      return this.shape.y += speed;
    };

    Piece.prototype.animateLeft = function() {
      if (this.movingRight) {
        this.col++;
        this.shape.x = this.col * this.playArea.cellWidth;
        this.movingRight = false;
      }
      return this.movingLeft = true;
    };

    Piece.prototype.animateRight = function() {
      if (this.movingLeft) {
        this.col--;
        this.shape.x = this.col * this.playArea.cellWidth;
        this.movingLeft = false;
      }
      return this.movingRight = true;
    };

    Piece.prototype.animateRotate = function() {
      return this.rotating = true;
    };

    Piece.prototype.down = function() {
      return this.row++;
    };

    Piece.prototype.up = function() {
      return this.row--;
    };

    Piece.prototype.left = function() {
      this.col--;
      return this.shape.x = this.col * this.playArea.cellWidth;
    };

    Piece.prototype.right = function() {
      this.col++;
      return this.shape.x = this.col * this.playArea.cellWidth;
    };

    Piece.prototype.rotate = function(direction) {
      if (direction == null) direction = 'cw';
      if (direction === 'cw') {
        this.rotationIndex = (this.rotationIndex + 1) % 4;
      } else {
        this.rotationIndex = (this.rotationIndex - 1) % 4;
      }
      this.cells = Piece.shapes[this.type][this.rotationIndex];
      this.shape.shape = this.cells;
      return this.shape.rotation = 0;
    };

    Piece.prototype.updateShape = function() {
      this.shape.x = this.col * this.playArea.cellWidth;
      this.shape.y = this.row * this.playArea.cellHeight;
      this.shape.shape = this.cells;
      return this.shape.rotation = 0;
    };

    Piece.prototype.copy = function(piece) {
      this.type = piece.type;
      this.row = piece.row;
      this.col = piece.col;
      this.rotationIndex = piece.rotationIndex;
      return this.cells = Piece.shapes[this.type][this.rotationIndex];
    };

    Piece.prototype.update = function() {
      if (this.rotating) {
        this.shape.rotation += this.rotateSpeed;
        if (this.shape.rotation >= 1.57) {
          this.rotate();
          this.rotating = false;
        }
      }
      if (this.movingLeft) {
        this.shape.x -= this.horizontalSpeed;
        if (this.shape.x <= (this.col - 1) * this.playArea.cellWidth) {
          this.left();
          this.movingLeft = false;
        }
      }
      if (this.movingRight) {
        this.shape.x += this.horizontalSpeed;
        if (this.shape.x >= (this.col + 1) * this.playArea.cellWidth) {
          this.right();
          this.movingRight = false;
        }
      }
      if (this.shape.y >= (this.row + 1) * this.playArea.cellHeight) {
        return this.down();
      }
    };

    Piece.prototype.draw = function(ctx) {
      return this.shape.draw(ctx);
    };

    return Piece;

  })();

  PieceShape = (function() {

    function PieceShape(shape, x, y, cellWidth, cellHeight, rotation, pivot, color) {
      this.shape = shape;
      this.x = x;
      this.y = y;
      this.cellWidth = cellWidth;
      this.cellHeight = cellHeight;
      this.rotation = rotation;
      this.pivot = pivot;
      this.color = color;
    }

    PieceShape.prototype.draw = function(ctx) {
      var cell, rect, _i, _len, _ref, _results;
      _ref = this.shape;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cell = _ref[_i];
        rect = new Rect(this.x + cell[1] * this.cellWidth + 1, this.y + cell[0] * this.cellHeight + 1, this.cellWidth - 1, this.cellHeight - 1, this.color);
        ctx.save();
        ctx.translate(this.x + this.pivot * this.cellWidth, this.y + this.pivot * this.cellHeight);
        ctx.rotate(this.rotation);
        rect.x -= this.x + this.pivot * this.cellWidth;
        rect.y -= this.y + this.pivot * this.cellWidth;
        rect.draw(ctx);
        _results.push(ctx.restore());
      }
      return _results;
    };

    return PieceShape;

  })();

}).call(this);
