class Rect
  constructor = (@x, @y, @w, @h) ->

  draw = (ctx) ->
    ctx.beginPath()
    ctx.rect @x, @y, @w, @h
    ctx.closePath()
    ctx.fill()
