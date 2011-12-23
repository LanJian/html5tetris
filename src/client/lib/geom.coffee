class window.Rect
  constructor: (@x, @y, @w, @h, @color='black') ->

  draw: (ctx) ->
    ctx.fillStyle = @color
    ctx.beginPath()
    ctx.rect @x, @y, @w, @h
    ctx.closePath()
    ctx.fill()

