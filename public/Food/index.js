// Food

class Food {
  hasProcessed = false;

  constructor(game, foodAsset, initX, initY){
    this.game = game;
    this.sprite = this.game.add.sprite(initX, initY, foodAsset);
    this.sprite.anchor.setTo(0.5, 0.5);
  }
}