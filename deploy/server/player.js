(function() {
  var Player;

  Player = (function() {

    function Player(clientId) {
      var t;
      this.clientId = clientId;
      t = this;
      nowjs.getClient(this.clientId, function(err) {
        t.playArea = this.now.playArea;
        return t.opponentArea = this.now.opponentArea;
      });
    }

    Player.prototype.clear = function() {
      return nowjs.getClient(this.clientId, function(err) {
        return this.now.clear();
      });
    };

    Player.prototype.update = function() {
      this.playArea.update();
      return this.opponentArea.update();
    };

    Player.prototype.draw = function() {
      this.clear();
      return nowjs.getClient(this.clientId, function(err) {
        return this.now.draw();
      });
    };

    return Player;

  })();

  module.exports = Player;

}).call(this);
