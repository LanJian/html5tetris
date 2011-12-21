class window.Piece
  # holds logic info for the piece
  # 5x5 array
  # the pivot is always [2,2], except for O.
  
  # Static
  @shapes =
    i: [
      [[2,1],[2,2],[2,3],[2,4]]
      [[1,2],[2,2],[3,2],[4,2]]
      [[2,0],[2,1],[2,2],[2,3]]
      [[0,2],[1,2],[2,2],[3,2]]
    ]
    j: [
      [[1,1],[2,1],[2,2],[2,3]]
      [[1,2],[1,3],[2,2],[3,2]]
      [[2,1],[2,2],[2,3],[3,3]]
      [[1,2],[2,2],[3,2],[3,1]]
    ]
    l: [
      [[1,3],[2,1],[2,2],[2,3]]
      [[1,2],[2,2],[3,2],[3,3]]
      [[2,1],[2,2],[2,3],[3,1]]
      [[1,1],[1,2],[2,2],[3,2]]
    ]
    o: [
      [[2,2],[2,3],[3,2],[3,3]]
      [[2,2],[2,3],[3,2],[3,3]]
      [[2,2],[2,3],[3,2],[3,3]]
      [[2,2],[2,3],[3,2],[3,3]]
      [[2,2],[2,3],[3,2],[3,3]]
    ]
    s: [
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
      [[2,1],[2,2],[2,3],[2,4]]
    ]
    t: [
      [[2,1],[2,2],[2,3],[1,2]]
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
    @rotationIndex = 0
    @cells = Piece.shapes[@type][@rotationIndex]
    @row = 0
    @col = 0
    @rotating = false
    @movingLeft = false
    @movingRight = false

    pivot = if @type is 'o' then 3 else 2.5
    @shape = new PieceShape @cells, @col*@playArea.cellWidth,
      0, @playArea.cellWidth, @playArea.cellHeight, 0, pivot

  drop: ->

  update: ->
    if rotatePressed
      @rotating = true
    if @rotating
      @shape.rotation+=0.5
      if @shape.rotation >= 1.57
        @rotationIndex = (@rotationIndex + 1) % 4
        @cells = Piece.shapes[@type][@rotationIndex]
        @shape.shape = @cells
        @shape.rotation = 0
        @rotating = false

    if leftPressed
      if @movingRight
        @col++
        @shape.x = @col*@playArea.cellWidth
        @movingRight = false
      @movingLeft = true
    if @movingLeft
      @shape.x -= 5
      if @shape.x <= (@col-1)*@playArea.cellWidth
        @col--
        @shape.x = @col*@playArea.cellWidth
        @movingLeft = false
        
    if rightPressed
      if @movingLeft
        @col--
        @shape.x = @col*@playArea.cellWidth
        @movingLeft = false
      @movingRight = true
    if @movingRight
      @shape.x += 5
      if @shape.x >= (@col+1)*@playArea.cellWidth
        @col++
        @shape.x = @col*@playArea.cellWidth
        @movingRight = false

    if downPressed
      @shape.y+=5

  draw: (ctx) ->
    @shape.draw ctx


class PieceShape
  # holds geometry info for the piece
  # this class actually draws the piece on screen
  # x,y is the coordinate of the top left corner of the 5x5 matrix
  # rotation in respect to the shape passed in
  constructor: (@shape, @x, @y, @cellWidth, @cellHeight, @rotation, @pivot) ->

  draw: (ctx) ->
    for cell in @shape
      rect = new Rect @x + cell[1]*@cellWidth + 1, @y + cell[0]*@cellHeight + 1, @cellWidth - 1, @cellHeight - 1, 'blue'
      ctx.save()
      ctx.translate @x + @pivot*@cellWidth, @y + @pivot*@cellHeight
      ctx.rotate @rotation
      rect.x-=(@x + @pivot*@cellWidth)
      rect.y-=(@y + @pivot*@cellWidth)
      rect.draw ctx
      ctx.restore()

