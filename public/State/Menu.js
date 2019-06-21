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
    this.btn1 = game.add.button(80, 500, 'btn1', this.onclick, this, 1, 1, 0);
    game.add.text(250, 530, 'START', { font: 'bold 30px verdana', fill: '#fff' });
    this.btn2 = game.add.image(500, 500, 'btn2');
    game.add.text(645, 530, 'TUTORIAL', { font: 'bold 30px verdana', fill: '#fff' });
    this.btn3 = game.add.image(900, 500, 'btn3');
    game.add.text(1050, 530, 'SETTING', { font: 'bold 30px verdana', fill: '#fff' });
    this.croco = game.add.image(30, 390, 'croco');
    this.mouse = game.add.image(450, 400, 'mouse');
    this.taco = game.add.image(850, 400, 'taco');
    this.menumusic = game.add.audio('menusound');
    this.menumusic.play();
  }

  onclick() {
    this.menumusic.stop();
    game.state.start('MainGame');
  }

    update() {
    // Update Hook, 整個 State 的邏輯，能乾淨就乾淨
    this.bg.tilePosition.x -= 2;

  }

  // Miscellaneous Callback Definition
  // method 定義方法很簡單
}