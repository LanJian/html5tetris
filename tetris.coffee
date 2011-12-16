class Rect
  constructor: (@x, @y, @w, @h) ->

  draw: (ctx) ->
    ctx.beginPath()
    ctx.rect @x, @y, @w, @h
    ctx.closePath()
    ctx.fill()

class Piece
  # 5x5 array
  # the pivot is always [2,2]
  constructor: (@type) ->
    @shape = new Array
    switch @type.toLowerCase()
      when 'i'
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[1,2],[2,2],[3,2],[4,2]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
      when 'j'
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
      when 'l'
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
      when 'o'
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
      when 's'
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
      when 't'
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
      when 'z'
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]
        @data.push [[2,1],[2,2],[2,3],[2,4]]

  draw



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
