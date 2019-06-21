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

    // Move Animation
    this.sprite.frame = 8;
    this.sprite.animations.add('right', [12, 13, 14, 15], 8, true);
    this.sprite.animations.add('left', [4, 5, 6, 7], 8, true);
    this.sprite.animations.add('up', [0, 1, 2, 3], 8, true);
    this.sprite.animations.add('down', [8, 9, 10, 11], 8, true);
    this.sprite.physicsBodyType = Phaser.Physics.ARCADE;
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

  takeItem(onion) {
    if(!isHolding){
      this.sprite.addChild(onion);
    }
  }

  // Delete Whole Object
  delete() {
    console.log(`Player Delete ${this.socketId}`);
    // Delete Sprite
    this.sprite.destroy();
  }

}