class ProgressBar {
  constructor(game, x, y, width, height, time=50, repeat=100, callback, context) {
    this.game = game;

    this.graphics = this.game.add.graphics();

    this.callback = callback;
    this.context = context;

    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;

    this.timer = this.game.time.create();
    this.timeEvent = this.timer.repeat(time, repeat, this.update, this);
    this.timer.start();
    
    this.count = 0;
  }

  update() {
    this.count += 1;
    this.graphics.moveTo(this.x, this.y);

    this.graphics.clear();
    this.graphics.beginFill(0xAAAAAA);
    this.graphics.drawRect(this.x, this.y, this.width, this.height);
    this.graphics.beginFill(0x619821);
    this.graphics.drawRect(this.x, this.y, this.width * (this.count / 100), this.height);
    this.graphics.endFill();

    // Destroy
    if (this.count === 100) {
      this.destroy();
    }
  }

  destroy() {
    setTimeout(() => {
      this.graphics.destroy();
      this.callback.call(this.context);
    }, 600);
  }

  pause() {
    this.timer.pause();
  }
}