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
    game.load.tilemap('map', 'assets/Map10.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('red', 'assets/blockRed10.png');
    game.load.image('tiles', 'assets/Map.jpg');
    
    // Food
    this.game.load.spritesheet('onion-1', './assets/onion-1.png',32, 32);
    this.game.load.spritesheet('meat', './assets/meat.png', 32, 32);
    this.game.load.spritesheet('mushroom', './assets/mushroom.png', 32, 32);
    this.game.load.spritesheet('tomato', './assets/tomato.png', 32, 32);

    this.onions = game.add.physicsGroup();
    this.onions.enableBody = true;
    this.mushrooms = game.add.physicsGroup();
    this.mushrooms.enableBody = true;
    this.tomatos = game.add.physicsGroup();
    this.tomatos.enableBody = true;
    // Player
    this.game.load.spritesheet('player1', './assets/player1.png', 64, 64);
    this.game.load.spritesheet('player2', './assets/player2.png', 64, 64);
    this.game.load.spritesheet('player3', './assets/player3.png', 64, 64);
    this.game.load.spritesheet('player4', './assets/player4.png', 64, 64);
  }

  async create() {
    // Create Hook, 對這個 State 做 Init
    // Map

    await this.testConnector();

    var map = game.add.tilemap('map');

    this.map = map;

    map.addTilesetImage('Map10', 'tiles');
    map.addTilesetImage('blockRed10', 'red');

    map.createLayer('base');

    var collisionLayer = map.createLayer('collision');
    this.collisionLayer = collisionLayer;

    collisionLayer.visible = false;

    map.setCollisionByExclusion([], true, this.collisionLayer);
    collisionLayer.resizeWorld();

    
    // Get Player Info
    let playerInfos = await SocketConnector.getPlayersInfo();

    this.players = playerInfos.map(p => {
      let position = PlayerPosition[p.playerPosition];
      let newPlayer = new Player(this.game, 'player1', position.x, position.y, p.socketId);

      // Set Player
      if (newPlayer.socketId === this.game.socket.id) this.player = newPlayer;

      return newPlayer;
    });

    // Sync Socket.
    SocketConnector.syncAllSocket(this.players, this, this.syncUpCallback);

    // 新增對 Update Room 的反應
    SocketConnector.addEventListner('updateRoom', roomInfo => {
      let { members } = roomInfo;
      let targetMember = null;

      // 尋找 target SocketId
      // 減少成員
      if (members.length < this.players.length) {
        for (let player of this.players) {
          if (members.findIndex(m => m.socketId === player.socketId) === -1) {
            targetMember = player;
            break;
          }
        }

        // Remove Member
        let playerIdx = this.players.findIndex(p => p.socketId === targetMember.socketId);
        let player = this.players[playerIdx];

        player.delete();

        // Remove From Players
        this.players.splice(playerIdx, 1);
        console.log(`Remove Player ${targetMember.socketId}.`);
      }
      // 新增成員 
      else if (members.length > this.players.length) {
        for (let member of members) {
          if (this.players.findIndex(p => p.socketId === member.socketId) === -1) {
            targetMember = member;
            break;
          }
        }

        // Add Player (DOC)
        let position = PlayerPosition[targetMember.playerPosition];
        this.players.push(new Player(this.game, 'player1', position.x, position.y, targetMember.socketId));
        console.log(`Add Player ${targetMember.socketId}.`);
      }
    }, this);

    map.createLayer('foreground');

    // Add Key Control Callback
    this.game.input.keyboard.createCursorKeys();
    this.game.input.keyboard.addCallbacks(this, this.keyDone, this.keyUp);

    //Create Food Pool
    this.onions.createMultiple(50, 'onion-1');
    this.tomatos.createMultiple(50, 'tomato');
    this.mushrooms.createMultiple(50, 'mushroom');


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
    if(key === ' ') console.log();
  }

  keyUp() {

  }

  syncUpCallback(idx, controlMes, target) {
    console.log(target);
    console.log(controlMes);
    if(controlMes === 'go Left'){
      target.sprite.animations.play('left');
    } else if (controlMes === 'go Right'){
      target.sprite.animations.play('right');
    } else if (controlMes === 'go Up') {
      target.sprite.animations.play('up');
    } else if (controlMes === 'go Down') {
      target.sprite.animations.play('down');
    }
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
