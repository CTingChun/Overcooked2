// Player
class Player {

  // Constant Variable
  playerVelocity = 200;
  isHolding = false;

  constructor(game, playerAsset, initX, initY, socketId, positionId) {
    this.game = game;
    this.sprite = this.game.add.sprite(initX, initY, playerAsset);

    this.sprite.scale.setTo(2, 2);
    this.sprite.anchor.setTo(0.5,0.5);

    this.positionId = positionId;

    // Connector Used.
    this.socketId = socketId;

    // Enable Sprite
    this.game.physics.arcade.enable(this.sprite);

    // Move Animation
    this.sprite.frame = 8;
    this.sprite.animations.add('right', [12, 13, 14, 15, 14, 13], 8, true);
    this.sprite.animations.add('left', [4, 5, 6, 7, 6, 5], 8, true);
    this.sprite.animations.add('up', [0, 1, 2, 3, 2, 1], 8, true);
    this.sprite.animations.add('down', [8, 9, 10, 11, 10, 9], 8, true);

    //worldBound
    this.sprite.body.collideWorldBounds = true;

    
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

  cleanVelocityX() {
    SocketConnector.update('spriteBody', {
      'velocity.x': 0
    }, 'stop X');
  }

  cleanVelocityY() {
    SocketConnector.update('spriteBody', {
      'velocity.y': 0
    }, 'stop Y');
  }

  takeItem(onion) {
    if (!isHolding) {
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