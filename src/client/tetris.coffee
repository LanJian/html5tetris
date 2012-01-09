
ctx = null
WIDTH = null
HEIGHT = null
playArea = null
opponentArea = null


$(document).ready ->
  init()

clear = ->
  ctx.clearRect 0, 0, WIDTH, HEIGHT

init = ->
  console.log "init"
  now.name = prompt "What's your name?", ""
  canvas = $('#canvas')[0]
  WIDTH = canvas.width
  HEIGHT = canvas.height
  ctx = canvas.getContext '2d'
  


draw = ->
  clear()
  playArea.draw ctx
  opponentArea.draw ctx

update = ->
  playArea.update()

gameLoop = ->
  update()
  draw()
  # 30 fps
  setTimeout gameLoop, 1000/30

now.joinGame = (pos) ->
  playArea = new PlayArea pos*400, 0, 300, HEIGHT
  playArea.registerKeys $('#canvas')
  opponentArea = new PlayArea (pos+1)%2*400, 0, 300, HEIGHT
  gameLoop()
