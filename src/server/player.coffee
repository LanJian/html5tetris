class Player
  constructor: (@clientId) ->
    t = this
    nowjs.getClient @clientId, (err) ->
      t.playArea = @now.playArea
      t.opponentArea = @now.opponentArea

  clear: ->
    nowjs.getClient @clientId, (err) ->
      @now.clear()

  update: ->
    @playArea.update()
    @opponentArea.update()

  draw: ->
    @clear()
    nowjs.getClient @clientId, (err) ->
      @now.draw()

module.exports = Player
