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
    }, 'go Left');
  }

  moveRight() {
    // this.player.body.velocity.x = playerVelocity;

    SocketConnector.update('spriteBody', {
      'velocity.x': this.playerVelocity
    }, 'go Right');
  }

  moveUp() {
    // this.player.body.velocity.y = -playerVelocity;

    SocketConnector.update('spriteBody', {
      'velocity.y': -this.playerVelocity
    }, 'go Up');
  }

  moveDown() {
    // this.player.body.velocity.x = playerVelocity;

    SocketConnector.update('spriteBody', {
      'velocity.y': this.playerVelocity
    }, 'go Down');
  }

  takeItem() {
    if(!isHolding){
      isHolding = !isHolding;
      
    }
  }

  // Delete Whole Object
  delete() {
    console.log(`Player Delete ${this.socketId}`);
    // Delete Sprite
    this.sprite.destroy();
  }
}