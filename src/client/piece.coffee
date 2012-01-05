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
    ]
    s: [
      [[1,2],[1,3],[2,1],[2,2]]
      [[1,2],[2,2],[2,3],[3,3]]
      [[2,2],[2,3],[3,1],[3,2]]
      [[1,1],[2,1],[2,2],[3,2]]
    ]
    t: [
      [[2,1],[2,2],[2,3],[3,2]]
      [[1,2],[2,1],[2,2],[3,2]]
      [[2,1],[2,2],[2,3],[1,2]]
      [[1,2],[2,2],[2,3],[3,2]]
    ]
    z: [
      [[1,1],[1,2],[2,2],[2,3]]
      [[1,3],[2,2],[2,3],[3,2]]
      [[2,1],[2,2],[3,2],[3,3]]
      [[1,2],[2,1],[2,2],[3,1]]
    ]


  constructor: (@type, @playArea, @color = 'blue') ->
    @rotationIndex = 0
    @cells = Piece.shapes[@type][@rotationIndex]
    @row = if @type is 't' or @type is 'o' then -4 else -3
    @col = 2
    @rotating = false
    @movingLeft = false
    @movingRight = false

    @rotateSpeed = 0.5
    @horizontalSpeed = 10

    pivot = if @type is 'o' then 3 else 2.5
    @shape = new PieceShape @cells, @col*@playArea.cellWidth,
      @row*@playArea.cellHeight, @playArea.cellWidth, @playArea.cellHeight, 0, pivot, @color

  animateDown: (speed = 8) ->
    @shape.y+=speed

  animateLeft: ->
    if @movingRight
      @col++
      @shape.x = @col*@playArea.cellWidth
      @movingRight = false
    @movingLeft = true
    
  animateRight: ->
    if @movingLeft
      @col--
      @shape.x = @col*@playArea.cellWidth
      @movingLeft = false
    @movingRight = true

  animateRotate: ->
    @rotating = true

  down: ->
    @row++

  up: ->
    @row--

  left: ->
    @col--
    @shape.x = @col*@playArea.cellWidth

  right: ->
    @col++
    @shape.x = @col*@playArea.cellWidth

  rotate: (direction = 'cw') ->
    if direction is 'cw'
      @rotationIndex = (@rotationIndex + 1) % 4
    else
      @rotationIndex = (@rotationIndex - 1) % 4
    @cells = Piece.shapes[@type][@rotationIndex]
    @shape.shape = @cells
    @shape.rotation = 0

  updateShape: ->
    @shape.x = @col*@playArea.cellWidth
    @shape.y = @row*@playArea.cellHeight
    @shape.shape = @cells
    @shape.rotation = 0

  copy: (piece) ->
    @type = piece.type
    @row = piece.row
    @col = piece.col
    @rotationIndex = piece.rotationIndex
    @cells = Piece.shapes[@type][@rotationIndex]

  update: ->
    if @rotating
      @shape.rotation+=@rotateSpeed
      if @shape.rotation >= 1.57
        @rotate()
        @rotating = false

    if @movingLeft
      @shape.x -= @horizontalSpeed
      if @shape.x <= (@col-1)*@playArea.cellWidth
        @left()
        @movingLeft = false
        
    if @movingRight
      @shape.x += @horizontalSpeed
      if @shape.x >= (@col+1)*@playArea.cellWidth
        @right()
        @movingRight = false

    if @shape.y >= (@row+1)*@playArea.cellHeight
      @down()

  draw: (ctx) ->
    @shape.draw ctx


class PieceShape
  # holds geometry info for the piece
  # this class actually draws the piece on screen
  # x,y is the coordinate of the top left corner of the 5x5 matrix
  # rotation in respect to the shape passed in
  constructor: (@shape, @x, @y, @cellWidth, @cellHeight, @rotation, @pivot, @color) ->

  draw: (ctx) ->
    for cell in @shape
      rect = new Rect @x + cell[1]*@cellWidth + 1, @y + cell[0]*@cellHeight + 1, @cellWidth - 1, @cellHeight - 1, @color
      ctx.save()
      ctx.translate @x + @pivot*@cellWidth, @y + @pivot*@cellHeight
      ctx.rotate @rotation
      rect.x-=(@x + @pivot*@cellWidth)
      rect.y-=(@y + @pivot*@cellWidth)
      rect.draw ctx
      ctx.restore()

