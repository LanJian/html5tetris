
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
  
  playArea = new PlayArea 0, 0, WIDTH, HEIGHT
  playArea.setCurrentPiece new Piece 'o', playArea

  window.leftPressed = false
  window.rightPressed = false
  window.downPressed =  false
  window.rotatePressed = false

  $('#canvas').keydown (e) ->
    e.preventDefault()
    switch e.which
      when 37 then window.leftPressed = true
      when 39 then window.rightPressed = true
      when 40 then window.downPressed = true
      when 90 then window.rotatePressed = true
      when 38 then playArea.dropAndCommit()

  $('#canvas').keyup (e) ->
    e.preventDefault()
    switch e.which
      when 37 then window.leftPressed = false
      when 39 then window.rightPressed = false
      when 40 then window.downPressed =  false
      when 90 then window.rotatePressed = false

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
