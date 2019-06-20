// Player
class Player {

  // Constant Variable
  playerVelocity = 100;
  isHolding = false;

  constructor(game, playerAsset, initX, initY, socketId) {
    this.game = game;
    this.sprite = this.game.add.sprite(initX, initY, playerAsset);

    // Connector Used.
    this.socketId = socketId;

    // Enable Sprite
    this.game.physics.enable(this.sprite);
  }

  moveLeft() {
    // this.player.body.velocity.x = - this.playerVelocity;

    SocketConnector.update('spriteBody', {
      'velocity.x': -this.playerVelocity
    })
  }

  moveRight() {
    // this.player.body.velocity.x = playerVelocity;

    SocketConnector.update('spriteBody', {
      'velocity.x': this.playerVelocity
    })
  }

  moveUp() {
    // this.player.body.velocity.y = -playerVelocity;

    SocketConnector.update('spriteBody', {
      'velocity.y': -this.playerVelocity
    })
  }

  moveDown() {
    // this.player.body.velocity.x = playerVelocity;

    SocketConnector.update('spriteBody', {
      'velocity.y': this.playerVelocity
    })
  }

  takeItem() {
    if(!isHolding){
      isHolding = !isHolding;
      
    }
  }
}