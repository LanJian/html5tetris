
ctx = null
WIDTH = null
HEIGHT = null
playArea = null


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
  
  playArea = new PlayArea 0, 0, 300, HEIGHT
  playArea.registerKeys $('#canvas')

  gameLoop()


draw = ->
  clear()
  playArea.draw ctx

update = ->
  playArea.update()

gameLoop = ->
  update()
  draw()
  # 30 fps
  setTimeout gameLoop, 1000/30
