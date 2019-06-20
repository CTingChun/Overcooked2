class MainGame extends Phaser.State {
  constructor() {
    // Constructor, 基本上不用加東西
    super();
  }

  preload() {
    // Preload Hook, 載入資料

    // Map
    game.load.tilemap('map', 'assets/try1.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('green', 'assets/blockGreen.png');
    game.load.image('red', 'assets/blockRed.png');
    game.load.image('tiles', 'assets/template.jpg');

    game.load.image('player', 'assets/sprite.png');
  }

  create() {
    // Create Hook, 對這個 State 做 Init

    // Map
    this.initTilemap();

    this.initKeyboard();

    this.resetPlayer();

    game.input.keyboard.addKey(Phaser.KeyCode.C).onDown.add(() => {
      this.collisionLayer.visible = !this.collisionLayer.visible;
    });
  }

  update() {
    // Update Hook, 整個 State 的邏輯，能乾淨就乾淨
    this.updatePlayer();

    game.physics.arcade.collide(this.player, this.collisionLayer);
  }

  // Miscellaneous Callback Definition
  // method 定義方法很簡單
  initPlayer() {
    var player = game.add.sprite(0,0,'player');
    this.player = player;

    player.MOVE_SPEED = 150;
    player.anchor.set(0.5);
    player.scale.set(0.6);

    game.physics.arcade.enable(player);
  }

  initKeyboard() {
    this.keyboardCursors = game.input.keyboard.createCursorKeys();
    this.moveSpeed = { x: 0, y: 0 }

    this.wasd = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    };
  }

  resetPlayer() {
    // pull the entrace and start coordinates from the objects layer
    var start = this.map.objects.meta.find(o => o.name == 'start');

    this.player.position.set(start.x, start.y);
    this.player.angle = 0;
  }

  updatePlayer() {
    var keyboardCursors = this.keyboardCursors;
    var wasd = this.wasd;
    var player = this.player;
    var moveSpeed = this.moveSpeed;

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (keyboardCursors.left.isDown || wasd.left.isDown)
        moveSpeed.x = -player.MOVE_SPEED;
    else if (keyboardCursors.right.isDown || wasd.right.isDown)
        moveSpeed.x = player.MOVE_SPEED;
    else
        moveSpeed.x = 0;

    // up and down keyboard movement
    if (keyboardCursors.up.isDown || wasd.up.isDown)
        moveSpeed.y = -player.MOVE_SPEED;
    else if (keyboardCursors.down.isDown || wasd.down.isDown)
        moveSpeed.y = player.MOVE_SPEED;
    else
        moveSpeed.y = 0;

    if (Math.abs(moveSpeed.x) > 0 || Math.abs(moveSpeed.y) > 0) {
        player.body.velocity.x = moveSpeed.x;
        player.body.velocity.y = moveSpeed.y;

        // set direction using Math.atan2
        /*let targetPos = { x: player.x + moveSpeed.x, y: player.y + moveSpeed.y };
        player.rotation = Math.atan2(targetPos.y - player.y, targetPos.x - player.x);*/
    }  
  }
}