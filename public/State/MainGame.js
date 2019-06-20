class MainGame extends Phaser.State {
  constructor() {
    // Constructor, 基本上不用加東西
    super();

    // Players Object
    this.players = [];
    this.player = null;
  }

  preload() {
    // Preload Hook, 載入資料

    // Map
    game.load.tilemap('map', 'assets/try1.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('green', 'assets/blockGreen.png');
    game.load.image('red', 'assets/blockRed.png');
    game.load.image('tiles', 'assets/template.jpg');
    
    // Food
    this.game.load.image('onion-1', './assets/onion-1.png');
  }

  async create() {
    // Create Hook, 對這個 State 做 Init
    // Map
    this.initTilemap();

    await this.testConnector();

    // Get Player Info
    let playerInfos = await SocketConnector.getPlayersInfo();

    let players = playerInfos.map(p => {
      let newPlayer = new Player(this.game, 'onion-1', 100, 100, p.socketId);

      // Set Player
      if (newPlayer.socketId === this.game.socket.id) this.player = newPlayer;

      return newPlayer;
    });

    // Sync Socket.
    SocketConnector.syncAllSocket(players);

    // Add Key Control Callback
    this.game.input.keyboard.createCursorKeys();
    this.game.input.keyboard.addCallbacks(this, this.keyDone, this.keyUp);
  }

  update() {
    // Update Hook, 整個 State 的邏輯，能乾淨就乾淨

  }

  // Miscellaneous Callback Definition
  // method 定義方法很簡單
  keyDone(event) {
    let { key } = event;

    if(key === 'ArrowLeft') this.player.moveLeft();
    if(key === 'ArrowRight') this.player.moveRight();
    if(key === 'ArrowDown') this.player.moveDown();
    if(key === 'ArrowUp') this.player.moveUp();
  }

  keyUp() {

  }

  initTilemap() {
    var map = game.add.tilemap('map');

    this.map = map;

    map.addTilesetImage('try1', 'tiles');
    map.addTilesetImage('blockGreen', 'green');
    map.addTilesetImage('blockRed', 'red');

    map.createLayer('base');

    var collisionLayer = map.createLayer('collision');
    this.collisionLayer = collisionLayer;

    collisionLayer.visible = false;

    map.setCollisionByExclusion([], true, this.collisionLayer);
    collisionLayer.resizeWorld();

    map.createLayer('foreground');
  }

  // Test Connector
  testConnector() {
    return new Promise(async (res, rej) => {
      // Test For Add To Team
      let roomMessage = await SocketConnector.createRoom('Test', 'Tester1');

      if (roomMessage === 'Duplicate Room Name') {
        await SocketConnector.joinRoom('Test', 'Tester2');
      }
      res();
    })
  }
}