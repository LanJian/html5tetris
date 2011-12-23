(function() {
  var PieceShape;

  window.Piece = (function() {

    Piece.shapes = {
      i: [[[2, 1], [2, 2], [2, 3], [2, 4]], [[1, 2], [2, 2], [3, 2], [4, 2]], [[2, 0], [2, 1], [2, 2], [2, 3]], [[0, 2], [1, 2], [2, 2], [3, 2]]],
      j: [[[1, 1], [2, 1], [2, 2], [2, 3]], [[1, 2], [1, 3], [2, 2], [3, 2]], [[2, 1], [2, 2], [2, 3], [3, 3]], [[1, 2], [2, 2], [3, 2], [3, 1]]],
      l: [[[1, 3], [2, 1], [2, 2], [2, 3]], [[1, 2], [2, 2], [3, 2], [3, 3]], [[2, 1], [2, 2], [2, 3], [3, 1]], [[1, 1], [1, 2], [2, 2], [3, 2]]],
      o: [[[2, 2], [2, 3], [3, 2], [3, 3]], [[2, 2], [2, 3], [3, 2], [3, 3]], [[2, 2], [2, 3], [3, 2], [3, 3]], [[2, 2], [2, 3], [3, 2], [3, 3]], [[2, 2], [2, 3], [3, 2], [3, 3]]],
      s: [[[1, 2], [1, 3], [2, 1], [2, 2]], [[1, 2], [2, 2], [2, 3], [3, 3]], [[2, 2], [2, 3], [3, 1], [3, 2]], [[1, 1], [2, 1], [2, 2], [3, 2]]],
      t: [[[2, 1], [2, 2], [2, 3], [3, 2]], [[1, 2], [2, 1], [2, 2], [3, 2]], [[2, 1], [2, 2], [2, 3], [1, 2]], [[1, 2], [2, 2], [2, 3], [3, 2]]],
      z: [[[1, 1], [1, 2], [2, 2], [2, 3]], [[1, 3], [2, 2], [2, 3], [3, 2]], [[2, 1], [2, 2], [3, 2], [3, 3]], [[1, 2], [2, 1], [2, 2], [3, 1]]]
    };

    function Piece(type, playArea) {
      var pivot;
      this.type = type;
      this.playArea = playArea;
      this.rotationIndex = 0;
      this.cells = Piece.shapes[this.type][this.rotationIndex];
      this.row = 0;
      this.col = 0;
      this.rotating = false;
      this.movingLeft = false;
      this.movingRight = false;
      this.rotateSpeed = 0.5;
      this.horizontalSpeed = 10;
      pivot = this.type === 'o' ? 3 : 2.5;
      this.shape = new PieceShape(this.cells, this.col * this.playArea.cellWidth, 0, this.playArea.cellWidth, this.playArea.cellHeight, 0, pivot);
    }

    Piece.prototype.moveDown = function() {
      return this.shape.y += 5;
    };

    Piece.prototype.moveLeft = function() {
      if (this.movingRight) {
        this.col++;
        this.shape.x = this.col * this.playArea.cellWidth;
        this.movingRight = false;
      }
      return this.movingLeft = true;
    };

    Piece.prototype.moveRight = function() {
      if (this.movingLeft) {
        this.col--;
        this.shape.x = this.col * this.playArea.cellWidth;
        this.movingLeft = false;
      }
      return this.movingRight = true;
    };

    Piece.prototype.rotate = function() {
      return this.rotating = true;
    };

    Piece.prototype.update = function() {
      if (this.rotating) {
        this.shape.rotation += this.rotateSpeed;
        if (this.shape.rotation >= 1.57) {
          this.rotationIndex = (this.rotationIndex + 1) % 4;
          this.cells = Piece.shapes[this.type][this.rotationIndex];
          this.shape.shape = this.cells;
          this.shape.rotation = 0;
          this.rotating = false;
        }
      }
      if (this.movingLeft) {
        this.shape.x -= this.horizontalSpeed;
        if (this.shape.x <= (this.col - 1) * this.playArea.cellWidth) {
          this.col--;
          this.shape.x = this.col * this.playArea.cellWidth;
          this.movingLeft = false;
        }
      }
      if (this.movingRight) {
        this.shape.x += this.horizontalSpeed;
        if (this.shape.x >= (this.col + 1) * this.playArea.cellWidth) {
          this.col++;
          this.shape.x = this.col * this.playArea.cellWidth;
          return this.movingRight = false;
        }
      }
    };

    Piece.prototype.draw = function(ctx) {
      return this.shape.draw(ctx);
    };

    return Piece;

  })();

  PieceShape = (function() {

    function PieceShape(shape, x, y, cellWidth, cellHeight, rotation, pivot) {
      this.shape = shape;
      this.x = x;
      this.y = y;
      this.cellWidth = cellWidth;
      this.cellHeight = cellHeight;
      this.rotation = rotation;
      this.pivot = pivot;
    }

    PieceShape.prototype.draw = function(ctx) {
      var cell, rect, _i, _len, _ref, _results;
      _ref = this.shape;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cell = _ref[_i];
        rect = new Rect(this.x + cell[1] * this.cellWidth + 1, this.y + cell[0] * this.cellHeight + 1, this.cellWidth - 1, this.cellHeight - 1, 'blue');
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
