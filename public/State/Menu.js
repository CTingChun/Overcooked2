class Menu extends Phaser.State {
  constructor() {
    // Constructor, 基本上不用加東西
    super();
  }

  preload() {
    // Preload Hook, 載入資料
    this.game.load.image('bg', '../assets/background.jpg');
    this.game.load.image('word', '../assets/overcooked.png');
    this.game.load.image('croco', '../assets/crocodile.png');
    this.game.load.image('mouse', '../assets/mouse.png');
    this.game.load.image('taco', '../assets/taco.png');
    this.game.load.image('btn1', '../assets/btn.png');
    this.game.load.image('btn2', '../assets/btn.png');
    this.game.load.image('btn3', '../assets/btn.png');
    this.game.load.audio('menusound', 'assets/menubgsound.mp3');
  }

  create() {
    // Create Hook, 對這個 State 做 Init
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.bg = game.add.tileSprite(0, 0, 1280, 720, 'bg');
    this.word = game.add.image(200, 10, 'word');
    this.btn1 = game.add.button(280, 500, 'btn1', this.onclick1, this, 1, 1, 0);
    game.add.text(450, 530, 'START', { font: 'bold 30px verdana', fill: '#fff' });
    this.btn2 = game.add.button(700, 500, 'btn2', this.onclick2, this, 1, 1, 0);
    game.add.text(850, 530, 'TUTORIAL', { font: 'bold 30px verdana', fill: '#fff' });
    this.croco = game.add.image(230, 390, 'croco');
    this.mouse = game.add.image(650, 400, 'mouse');
    this.menumusic = game.add.audio('menusound');
    this.menumusic.play();

    new ProgressBar(game, 100, 100, 200, 10);
  }

  onclick1() {
    this.menumusic.stop();
    game.state.start('MainGame');
  }
  onclick2() {
    this.menumusic.stop();
    game.state.start('Tutorial');
  }

  update() {
    // Update Hook, 整個 State 的邏輯，能乾淨就乾淨
    this.bg.tilePosition.x -= 2;
    if (this.btn1.input.pointerOver())
    {
      this.btn1.alpha = 0.6;
    }
    else
    {
      this.btn1.alpha = 1;
    }

    if (this.btn2.input.pointerOver())
    {
      this.btn2.alpha = 0.6;
    }
    else
    {
      this.btn2.alpha = 1;
    }

    
  }

  // Miscellaneous Callback Definition
  // method 定義方法很簡單
}