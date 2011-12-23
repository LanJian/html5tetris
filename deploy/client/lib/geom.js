(function() {

  window.Rect = (function() {

    function Rect(x, y, w, h, color) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.color = color != null ? color : 'black';
    }

    Rect.prototype.draw = function(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.w, this.h);
      ctx.closePath();
      return ctx.fill();
    };

    return Rect;

  })();

}).call(this);
