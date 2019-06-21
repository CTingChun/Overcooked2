// Player
class Player {

  // Constant Variable
  playerVelocity = 200;
  isHolding = false;

  //check item
  isOnion = false;
  isTomato = false;
  isMushroom = false;
  isPot = false;
  isPlate = false;

  holdingObject = null;

  constructor(game, playerAsset, initX, initY, socketId, positionId) {
    this.game = game;
    this.sprite = this.game.add.sprite(initX, initY, playerAsset);

    this.sprite.scale.setTo(2, 2);
    this.sprite.anchor.setTo(0.5,0.5);

    this.positionId = positionId;
    console.log(initX, initY);
    this.playerLabel = game.add.text(initX -6, initY - 70, `P${this.positionId}`, {
      font: '18px Arial',
      fill: '#ffffff'
    });
    // Connector Used.
    this.socketId = socketId;

    // Enable Sprite
    this.game.physics.arcade.enable(this.sprite);

    // Move Animation
    this.sprite.frame = 8;
    this.sprite.animations.add('right', [12, 13, 14, 15], 8, true);
    this.sprite.animations.add('left', [4, 5, 6, 7], 8, true);
    this.sprite.animations.add('up', [0, 1, 2, 3], 8, true);
    this.sprite.animations.add('down', [8, 9, 10, 11], 8, true);

    //Move with Onion
    this.sprite.animations.add('onion_right', [28, 29, 30, 31], 8, true);
    this.sprite.animations.add('onion_left', [20, 21, 22, 23], 8, true);
    this.sprite.animations.add('onion_up', [16, 17, 18, 19], 8, true);
    this.sprite.animations.add('onion_down', [24, 25, 26, 27], 8, true);

    //Move with Mushroom
    this.sprite.animations.add('mushroom_right', [44, 45, 46, 47 ], 8, true);
    this.sprite.animations.add('mushroom_left', [36, 37, 38, 39], 8, true);
    this.sprite.animations.add('mushroom_up', [32, 33, 34, 35], 8, true);
    this.sprite.animations.add('mushroom_down', [40, 41, 42, 43], 8, true);

    //Move with Tomato
    this.sprite.animations.add('tomato_right', [60, 61, 62, 63], 8, true);
    this.sprite.animations.add('tomato_left', [52, 53, 54, 55], 8, true);
    this.sprite.animations.add('tomato_up', [48, 49, 50, 51], 8, true);
    this.sprite.animations.add('tomato_down', [56, 57, 58, 59], 8, true);

    //Move with Pot
    this.sprite.animations.add('pot_right', [76, 77, 78, 79], 8, true);
    this.sprite.animations.add('pot_left', [68, 69, 70, 71], 8, true);
    this.sprite.animations.add('pot_up', [64, 65, 66, 67], 8, true);
    this.sprite.animations.add('pot_down', [72, 73, 74, 75], 8, true);

    //Move with Plate
    this.sprite.animations.add('plate_right', [92, 93, 94, 95], 8, true);
    this.sprite.animations.add('plate_left', [84, 85, 86, 87], 8, true);
    this.sprite.animations.add('plate_up', [80, 81, 82, 83], 8, true);
    this.sprite.animations.add('plate_down', [88, 89, 90, 91], 8, true);
    

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

  clearAllFlag() {
    if (!this.isPlate) {
      // Constant Variable
      this.isHolding = false;

      //check item
      this.isOnion = false;
      this.isTomato = false;
      this.isMushroom = false;
      this.isPot = false;
      this.isPlate = false;

      this.holdingObject = null;
    }
  }

}