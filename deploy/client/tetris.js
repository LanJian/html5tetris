(function() {
  var HEIGHT, WIDTH, clear, ctx, draw, gameLoop, init, playArea, update;

  ctx = null;

  WIDTH = null;

  HEIGHT = null;

  playArea = null;

  $(document).ready(function() {
    return init();
  });

  clear = function() {
    return ctx.clearRect(0, 0, WIDTH, HEIGHT);
  };

  init = function() {
    var canvas;
    console.log("init");
    canvas = $('#canvas')[0];
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    ctx = canvas.getContext('2d');
    playArea = new PlayArea(0, 0, 300, HEIGHT);
    playArea.registerKeys($('#canvas'));
    return gameLoop();
  };

  draw = function() {
    clear();
    return playArea.draw(ctx);
  };

  update = function() {
    return playArea.update();
  };

  gameLoop = function() {
    update();
    draw();
    return setTimeout(gameLoop, 1000 / 30);
  };

}).call(this);
