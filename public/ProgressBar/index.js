class ProgressBar {
  constructor(game, x, y, width, time) {
    this.game = game;

    this.graphics = this.game.add.graphics();

    this.x = x;
    this.y = y;

    this.width = width;

    this.timer = this.game.time.create();
    this.timeEvent = this.timer.repeat(time, 100, this.update, this);
    this.timer.start();
    
    this.count = 0;
  }

  update() {
    this.count += 1;
    this.graphics.moveTo(this.x, this.y);

    this.graphics.clear();
    this.graphics.beginFill(0xffffff);
    this.graphics.drawRect(this.x, this.y, this.width * (this.count / 100), 10);
    this.graphics.endFill();

    // Destroy
    if (this.count === 100) {
      this.destroy();
    }
  }

  destroy() {
    setTimeout(() => {
      this.graphics.destroy();
    }, 600);
  }
}