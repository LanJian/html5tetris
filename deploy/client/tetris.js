(function() {
  var HEIGHT, WIDTH, clear, ctx, draw, gameLoop, init, opponentArea, playArea, update;

  ctx = null;

  WIDTH = null;

  HEIGHT = null;

  playArea = null;

  opponentArea = null;

  $(document).ready(function() {
    return init();
  });

  clear = function() {
    return ctx.clearRect(0, 0, WIDTH, HEIGHT);
  };

  init = function() {
    var canvas;
    console.log("init");
    now.name = prompt("What's your name?", "");
    canvas = $('#canvas')[0];
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    return ctx = canvas.getContext('2d');
  };

  draw = function() {
    clear();
    playArea.draw(ctx);
    return opponentArea.draw(ctx);
  };

  update = function() {
    return playArea.update();
  };

  gameLoop = function() {
    update();
    draw();
    return setTimeout(gameLoop, 1000 / 30);
  };

  now.joinGame = function(pos) {
    playArea = new PlayArea(pos * 400, 0, 300, HEIGHT);
    playArea.registerKeys($('#canvas'));
    opponentArea = new PlayArea((pos + 1) % 2 * 400, 0, 300, HEIGHT);
    return gameLoop();
  };

}).call(this);
