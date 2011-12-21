class window.PlayArea
  constructor: (@x, @y, @w, @h) ->
    @currentPiece = null
    @cellWidth = @w/20
    @cellHeight = @h/20
    @matrix = ((0 for i in [1..20-1]) for j in [1..20-1])

    #testing 
    console.log @matrix
    @matrix[10][12] = 1
    @matrix[10][13] = 1
    @matrix[11][12] = 1
    @matrix[12][12] = 1
    @matrix[10][14] = 1

  setCurrentPiece: (@currentPiece) ->

  dropAndCommit: ->
    @currentPiece.drop()
    @commit()

  commit: ->
    #for cell in @currentPiece.cells
      #do nothing

  update: ->
    @currentPiece.update()

  draw: (ctx) ->
    # draw play area
    rect = new Rect @x, @y, @w, @h, 'grey'
    rect.draw ctx
    for i in [0..@matrix.length-1]
      for j in [0..@matrix[1].length-1]
        if @matrix[i][j] is 1
          rect = new Rect @x + j*@cellWidth + 1, @y + i*@cellHeight + 1,
            @cellWidth-1, @cellHeight-1, 'green'
          rect.draw ctx

    # draw current piece
    @currentPiece.draw ctx

