class Tutorial extends Phaser.State {
  constructor() {
    // Constructor, 基本上不用加東西
    super();
  }

  preload() {
    // Preload Hook, 載入資料      
    this.game.load.image('bg', '../assets/group.png');

  }

  create() {
    // Create Hook, 對這個 State 做 Init
    this.bg = game.add.image(0, 0, 'bg');

  }

  update() {
    // Update Hook, 整個 State 的邏輯，能乾淨就乾淨
  }

  // Miscellaneous Callback Definition
  // method 定義方法很簡單
}