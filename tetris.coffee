class Rect
  constructor: (@x, @y, @w, @h, @color='black') ->

  draw: (ctx) ->
    ctx.fillStyle = @color
    ctx.beginPath()
    ctx.rect @x, @y, @w, @h
    ctx.closePath()
    ctx.fill()

class Piece
  # holds logic info for the piece
  # 5x5 array
  # the pivot is always [2,2]
  @shapes =
    i: [
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
    ]
    j: [
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
    ]
    l: [
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
    ]
    o: [
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
    ]
    s: [
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
    ]
    t: [
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
    ]
    z: [
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
    ]

  constructor: (@type, @playArea) ->
    @shape = new PieceShape Piece.shapes[@type][0], 0, 0, @playArea.cellWidth, @playArea.cellHeight, 0

  update: ->
    @shape.update()

  draw: (ctx) ->
    @shape.draw ctx

class PieceShape
  # holds geometry info for the piece
  # x,y is the coordinate of the top left corner of the 5x5 matrix
  # rotation in respect to the shape passed in
  constructor: (@shape, @x, @y, @cellWidth, @cellHeight, @rotation) ->

  update: ->
    @rotation+=0.2

  draw: (ctx) ->
    for cell in @shape
      rect = new Rect @x + cell[1]*@cellWidth + 1, @y + cell[0]*@cellHeight + 1, @cellWidth - 1, @cellHeight - 1
      ctx.save()
      ctx.translate 2.5*@cellWidth, 2.5*@cellHeight
      ctx.rotate @rotation
      rect.x-=2.5*@cellWidth
      rect.y-=2.5*@cellWidth
      rect.draw ctx
      ctx.restore()

class PlayArea
  constructor: (@x, @y, @w, @h) ->
    @currentPiece = null
    @cellWidth = 20
    @cellHeight = 20

  setCurrentPiece: (@currentPiece) ->

  update: ->
    @currentPiece.update()

  draw: (ctx) ->
    rect = new Rect @x, @y, @w, @h, 'grey'
    rect.draw ctx
    @currentPiece.draw ctx



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
  playArea.setCurrentPiece new Piece 'i', playArea

  gameLoop()


draw = ->
  clear()
  playArea.draw ctx

update = ->
  playArea.update()

gameLoop = ->
  update()
  draw()
  setTimeout gameLoop, 1000/30
