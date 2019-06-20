// Player
class Player {

  // Constant Variable
  playerVelocity = 100;
  isHolding = false;

  constructor(game, playerAsset, initX, initY){
    this.game = game;
    this.player = this.game.add.sprite(initX, initY, playerAsset);
  }

  moveLeft() {
    this.player.body.velocity.x = -playerVelocity;
  }

  moveRight() {
    this.player.body.velocity.x = playerVelocity;
  }

  moveUp() {
    this.player.body.velocity.y = -playerVelocity;
  }

  moveDown() {
    this.player.body.velocity.x = playerVelocity;
  }

  takeItem() {
    if(!isHolding){
      isHolding = !isHolding;
      
    }
  }
}