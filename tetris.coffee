class Rect
  constructor: (@x, @y, @w, @h) ->

  draw: (ctx) ->
    ctx.beginPath()
    ctx.rect @x, @y, @w, @h
    ctx.closePath()
    ctx.fill()


ctx = null
rect = null
WIDTH = null
HEIGHT = null

$(document).ready ->
  init()

clear = ->
  ctx.clearRect 0, 0, WIDTH, HEIGHT

init = ->
  console.log "init"
  canvas = $('#canvas')[0]
  WIDTH = canvas.width
  HEIGHT = canvas.height
  ctx = canvas.getContext '2d'
  
  rect = new Rect 200, 200, 10, 10
  gameLoop()


draw = ->
  clear()
  rect.draw ctx

gameLoop = ->
  rect.x++
  draw()
  setTimeout gameLoop, 1000/30
