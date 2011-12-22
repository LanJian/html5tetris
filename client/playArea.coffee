class window.PlayArea
  # static
  @numCellsHigh = 20
  @numCellsWide = 10
  @pieceTypes = ['i', 'j', 'l', 'o', 's', 't', 'z']

  constructor: (@x, @y, @w, @h) ->
    @currentPiece = null
    @cellWidth = @w/PlayArea.numCellsWide
    @cellHeight = @h/PlayArea.numCellsHigh
    @matrix = ((0 for i in [1..PlayArea.numCellsWide]) for j in [1..PlayArea.numCellsHigh])

    @upKey = 38
    @downKey = 40
    @leftKey = 37
    @rightKey = 39
    @rotateKey = 90

    @leftPressed = false
    @rightPressed = false
    @downPressed =  false
    @rotatePressed = false

    @nextPiece()

  registerKeys: (receiver) ->
    t = this
    receiver.keydown (e) ->
      e.preventDefault()
      switch e.which
        when t.leftKey then t.leftPressed = true
        when t.rightKey then t.rightPressed = true
        when t.downKey then t.downPressed = true
        when t.rotateKey then t.rotatePressed = true
        when t.upKey then t.dropAndCommit()

    receiver.keyup (e) ->
      e.preventDefault()
      switch e.which
        when t.leftKey then t.leftPressed = false
        when t.rightKey then t.rightPressed = false
        when t.downKey then t.downPressed = false
        when t.rotateKey then t.rotatePressed = false

  dropAndCommit: ->
    @drop()
    @commit()
    @clearLines()
    @nextPiece()

  drop: ->
    until @checkCollision()
      @currentPiece.row++
    @currentPiece.row--

  commit: ->
    for cell in @currentPiece.cells
      @matrix[@currentPiece.row+cell[0]][@currentPiece.col+cell[1]] = 1

  clearLines: ->


  nextPiece: ->
    rand = Math.floor Math.random()*PlayArea.pieceTypes.length
    @currentPiece = new Piece PlayArea.pieceTypes[rand], this

  checkCollision: ->
    for cell in @currentPiece.cells
      # check bounds
      if @currentPiece.row+cell[0] >= PlayArea.numCellsHigh
        return true
      if @currentPiece.col+cell[1] < 0 or @currentPiece.col+cell[1] >= PlayArea.numCellsWide
        return true
      # check collision
      if @matrix[@currentPiece.row+cell[0]][@currentPiece.col+cell[1]] is 1
        return true
    return false

  update: ->
    if @downPressed
      @currentPiece.moveDown()
    if @leftPressed
      @currentPiece.moveLeft()
    if @rightPressed
      @currentPiece.moveRight()
    if @rotatePressed
      @currentPiece.rotate()

    @currentPiece.update()

  draw: (ctx) ->
    # draw play area
    rect = new Rect @x, @y, @w, @h, '#eeeeee'
    rect.draw ctx
    for i in [0..@matrix.length-1]
      for j in [0..@matrix[1].length-1]
        if @matrix[i][j] is 1
          rect = new Rect @x + j*@cellWidth + 1, @y + i*@cellHeight + 1,
            @cellWidth-1, @cellHeight-1, 'green'
          rect.draw ctx

    # draw current piece
    @currentPiece.draw ctx

