class window.PlayArea
  # static
  @numCellsHigh = 20
  @numCellsWide = 10
  @pieceTypes = ['i', 'j', 'l', 'o', 's', 't', 'z']

  constructor: (@x, @y, @w, @h) ->
    @currentPiece = null
    @ghost = null
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
    @upPressed = false

    @playing = true

    @clearList = []
    @clearing = false
    @clearFlash = 0

    @downSpeed = 3

    @piecesQueue = []
    for i in [0..3]
      rand = Math.floor Math.random()*PlayArea.pieceTypes.length
      @piecesQueue.push new Piece PlayArea.pieceTypes[rand], this

    @nextPiece()

  registerKeys: (receiver) ->
    t = this
    receiver.keydown (e) ->
      e.preventDefault()
      now.sendEvent 'down.' + e.which
      switch e.which
        when t.leftKey then t.leftPressed = true
        when t.rightKey then t.rightPressed = true
        when t.downKey then t.downPressed = true
        when t.rotateKey then t.rotatePressed = true
        when t.upKey then t.upPressed = true

    receiver.keyup (e) ->
      e.preventDefault()
      now.sendEvent 'up.' + e.which
      switch e.which
        when t.leftKey then t.leftPressed = false
        when t.rightKey then t.rightPressed = false
        when t.downKey then t.downPressed = false
        when t.rotateKey then t.rotatePressed = false
        when t.upKey then t.upPressed = false

  handleEvent: (e) ->
    tokens = e.split '.'
    t = this
    if tokens[0] is 'down'
      switch parseInt tokens[1]
        when t.leftKey then t.leftPressed = true
        when t.rightKey then t.rightPressed = true
        when t.downKey then t.downPressed = true
        when t.rotateKey then t.rotatePressed = true
        when t.upKey then t.upPressed = true
    else if tokens[0] is 'up'
      switch parseInt tokens[1]
        when t.leftKey then t.leftPressed = false
        when t.rightKey then t.rightPressed = false
        when t.downKey then t.downPressed = false
        when t.rotateKey then t.rotatePressed = false
        when t.upKey then t.upPressed = false


  dropAndCommit: ->
    @drop()
    @commit()
    @clearLines()
    @nextPiece()

  drop: (piece = @currentPiece) ->
    until @checkCollision(null, piece)
      piece.row++
    piece.row--

  commit: ->
    for cell in @currentPiece.cells
      if @currentPiece.row+cell[0] < 0
        @gameOver()
        return
      @matrix[@currentPiece.row+cell[0]][@currentPiece.col+cell[1]] = 1

  gameOver: ->
    @playing = false
    console.log 'game is over'

  clearLines: ->
    for i in [0..PlayArea.numCellsHigh-1]
      if @matrix[i].reduce((a, b) -> a and b)
        @clearList.push i
    if @clearList.length > 0
      @clearing = true

  collapse: ->
    for row in @clearList
      @matrix[1..row] = @matrix[0..row-1]
      @matrix[0] = (0 for num in [1..PlayArea.numCellsWide])
    @clearList = []

  nextPiece: ->
    @currentPiece = @piecesQueue.shift()
    @ghost = new Piece 'l', this, 'red'
    @ghost.copy @currentPiece
    @drop @ghost

    rand = Math.floor Math.random()*PlayArea.pieceTypes.length
    @piecesQueue.push new Piece PlayArea.pieceTypes[rand], this

  checkCollision: (transformation = ( -> ), p = @currentPiece) ->
    piece = $.extend(true, {}, p)
    piece.shape = $.extend(true, {}, p.shape)
    transformation.call(piece)
    for cell in piece.cells
      # check bounds
      if piece.row+cell[0] >= PlayArea.numCellsHigh
        return true
      if piece.col+cell[1] < 0 or piece.col+cell[1] >= PlayArea.numCellsWide
        return true
      # check collision
      if piece.row+cell[0] >= 0
        if @matrix[piece.row+cell[0]][piece.col+cell[1]] is 1
          return true
    return false

  update: ->
    if not @playing
      return

    if @clearing
      for i in @clearList
        @matrix[i] = @matrix[i].map (a) -> (a+1)%2
      @clearFlash++
      if @clearFlash >= 8
        for i in @clearList
          @matrix[i] = (0 for num in [1..PlayArea.numCellsWide])
        @clearing = false
        @clearFlash = 0
        @collapse()
    else
      if @downPressed
        @currentPiece.animateDown()
      if @leftPressed and not @checkCollision @currentPiece.left
        @currentPiece.animateLeft()
      if @rightPressed and not @checkCollision @currentPiece.right
        @currentPiece.animateRight()
      if @rotatePressed and not @checkCollision @currentPiece.rotate
        @currentPiece.animateRotate()
      if @upPressed
        @dropAndCommit()
        @upPressed = false

      @currentPiece.animateDown(@downSpeed)
      if @checkCollision @currentPiece.down
        @currentPiece.up()
        @dropAndCommit()

      @currentPiece.update()
      
      @ghost.copy @currentPiece
      @drop @ghost
      @ghost.updateShape()

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

    # draw next pieces
    #for i in [0..@piecesQueue.length-1]
      #p = @piecesQueue[i]
      #p.row = 0 + i*5
      #p.col = PlayArea.numCellsWide
      #p.draw ctx

    # draw current piece
    ctx.save()
    ctx.translate @x, @y
    @ghost.draw ctx
    @currentPiece.draw ctx
    ctx.restore()

