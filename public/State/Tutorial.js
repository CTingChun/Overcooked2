class Tutorial extends Phaser.State {
  constructor() {
    // Constructor, 基本上不用加東西
    super();
  }

  preload() {
    // Preload Hook, 載入資料      
    this.game.load.image('bg', '../assets/tutorialbg.png');
    this.game.load.spritesheet('cut', 'assets/cut.png', 80, 100);
    this.game.load.spritesheet('take', 'assets/take.png', 90, 85);
    this.game.load.spritesheet('move', 'assets/move.png', 120, 85);  
    this.game.load.audio('tusound', 'assets/tutorial.mp3');


  }

  create() {
    // Create Hook, 對這個 State 做 Init
    game.add.button(0, 0, 'bg', this.onclick, this, 1, 1, 0);
    game.add.text(520, 50, 'Controls', { font: 'bold 50px verdana', fill: '#fff' });
    this.text1 = game.add.text(400, 140, 'press x for cut space for take', { font: 'bold 30px verdana', fill: '#F19837' });
    game.add.tween(this.text1).to({y: this.text1.y+10}, 500).easing(Phaser.Easing.Bounce.Out).start();
    game.add.tween(this.text1).to({y: this.text1.y-10}, 500).yoyo(true).loop().start();

    this.ani1 = game.add.sprite(140, 550, 'cut');
    this.ani1.anchor.setTo(0.5, 0.5);
    this.ani1.animations.add('flyfly1', [ 0, 1 ], 5, true);
    this.ani1.play('flyfly1');
    this.ani2 = game.add.sprite(600, 670, 'take');
    this.ani2.anchor.setTo(0.5, 0.5);
    this.ani2.animations.add('flyfly1', [ 0, 1 ], 5, true);
    this.ani2.play('flyfly1');
    this.ani3 = game.add.sprite(1115, 390, 'move');
    this.ani3.anchor.setTo(0.5, 0.5);
    this.ani3.animations.add('flyfly1', [ 0, 1 ], 5, true);
    this.ani3.play('flyfly1');


    this.tumusic = game.add.audio('tusound');
    this.tumusic.play();

  }
  onclick() {
    this.tumusic.stop();
    game.state.start('Menu');
  }
  update() {
    // Update Hook, 整個 State 的邏輯，能乾淨就乾淨
  }

  // Miscellaneous Callback Definition
  // method 定義方法很簡單
}