class Menu extends Phaser.State {
  constructor() {
    // Constructor, 基本上不用加東西
    super();
  }

  preload() {
    // Preload Hook, 載入資料
    this.game.load.image('bg', '../assets/background.png');
    this.game.load.image('word', '../assets/overcooked.png');
  }

  create() {
    // Create Hook, 對這個 State 做 Init
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.bg = game.add.tileSprite(0, 0, 1280, 720, 'bg');
    this.word = game.add.image(0, 0, 'word');
  }

  update() {
    // Update Hook, 整個 State 的邏輯，能乾淨就乾淨
  }

  // Miscellaneous Callback Definition
  // method 定義方法很簡單
}