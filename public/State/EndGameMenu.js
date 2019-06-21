class EndGameMenu extends Phaser.State {
  constructor() {
    // Constructor, 基本上不用加東西
    super();
  }

  preload() {
    // Preload Hook, 載入資料
    this.game.load.image('bg', '../assets/endbg.jpg');
    this.game.load.image('close', '../assets/cancel.png');
    this.game.load.audio('endsound', 'assets/endgame.mp3');
    this.game.load.spritesheet('star', 'assets/star.png', 94, 100);
  }

  create() {
    // Create Hook, 對這個 State 做 Init
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.bg = game.add.image(0, 0, 'bg');
    game.add.button(920, 130, 'close', this.onclick, this, 1, 1, 0);
    game.add.text(350, 270, 'Orders Diliever', { font: 'bold 30px verdana', fill: '#fff' });
    game.add.text(350, 330, 'Tips', { font: 'bold 30px verdana', fill: '#fff' });
    game.add.text(350, 380, 'Orders Failed', { font: 'bold 30px verdana', fill: '#fff' });
    game.add.text(350, 470, 'Total', { font: 'bold 36px verdana', fill: '#fff' });
    this.ani1 = game.add.sprite(500, 210, 'star');
    this.ani1.anchor.setTo(0.5, 0.5);
    this.ani1.animations.add('flyfly1', [ 0, 1, 2, 3, 4 ], 10, true);
    this.ani1.play('flyfly1');
    this.ani2 = game.add.sprite(630, 210, 'star');
    this.ani2.anchor.setTo(0.5, 0.5);
    this.ani2.animations.add('flyfly2', [ 0, 1, 2, 3, 4 ], 10, true);
    this.ani2.play('flyfly2');
    this.ani3 = game.add.sprite(760, 210, 'star');
    this.ani3.anchor.setTo(0.5, 0.5);
    this.ani3.animations.add('flyfly3', [ 0, 1, 2, 3, 4 ], 10, true);
    this.ani3.play('flyfly3');
    this.endmusic = game.add.audio('endsound');
    this.endmusic.play();
  }

  onclick() {
    this.endmusic.stop();
    game.state.start('Menu');
  }

  update() {
    // Update Hook, 整個 State 的邏輯，能乾淨就乾淨

  }

  // Miscellaneous Callback Definition
  // method 定義方法很簡單
}