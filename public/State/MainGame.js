class MainGame extends Phaser.State {
  constructor() {
    // Constructor, 基本上不用加東西
    super();
    this.isReady = false;

    // Players Object
    this.players = [];
    this.player = null;

    // Score Related
    this.score = 0;
    this.requirements = [];

    this.currentCu1ProgressBar = null;
    this.currentCu2ProgressBar = null;
  }

  preload() {
    // Preload Hook, 載入資料

    // Map
    game.load.tilemap('map', 'assets/Map5.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('red', 'assets/blockRed5.png');
    game.load.image('tiles', 'assets/Map.jpg');

    // Food
    this.game.load.spritesheet('onion-1', './assets/onion-1.png', 32, 32);
    this.game.load.spritesheet('meat', './assets/meat.png', 32, 32);
    this.game.load.spritesheet('mushroom', './assets/mushroom.png', 32, 32);
    this.game.load.spritesheet('tomato', './assets/tomato.png', 32, 32);

    // Dish Requirement
    this.game.load.image('MashroomSoupRequirement', './assets/Mashroom-Dish-Requirement.png');
    this.game.load.image('OnionSoupRequirement', './assets/Onion-Soup-Requirement.png');
    this.game.load.image('TomatoSoupRequirement', './assets/Tomato-Soup-Requirement.png');

    this.onions = game.add.physicsGroup();
    this.onions.enableBody = true;
    this.mushrooms = game.add.physicsGroup();
    this.mushrooms.enableBody = true;
    this.tomatos = game.add.physicsGroup();
    this.tomatos.enableBody = true;
    // Player
    this.game.load.spritesheet('player1', './assets/player1.png', 36, 50);
    this.game.load.spritesheet('player2', './assets/player2.png', 32, 52);
    this.game.load.spritesheet('player3', './assets/player3.png', 28, 50);
    this.game.load.spritesheet('player4', './assets/player4.png', 28, 48);

    this.game.load.onLoadComplete.add(() => {

    });
  }

  async create() {
    // Create Hook, 對這個 State 做 Init
    // Map

    await this.testConnector();

    var map = game.add.tilemap('map');

    this.map = map;

    map.addTilesetImage('Map5', 'tiles');
    map.addTilesetImage('blockRed5', 'red');

    map.createLayer('base');

    var collisionLayer = map.createLayer('collision');
    this.collisionLayer = collisionLayer;

    collisionLayer.visible = false;

    map.setCollisionByExclusion([], true, this.collisionLayer);
    collisionLayer.resizeWorld();


    // Get Player Info
    let playerInfos = await SocketConnector.getPlayersInfo();

    //new player with different sprite
    this.players = playerInfos.map(p => {
      let position = PlayerPosition[p.playerPosition];
      let newPlayer;
      console.log(p.playerPosition);
      if (p.playerPosition == 0) {
        newPlayer = new Player(this.game, 'player1', position.x, position.y, p.socketId, p.playerPosition);
      }
      if (p.playerPosition == 1) {
        newPlayer = new Player(this.game, 'player2', position.x, position.y, p.socketId, p.playerPosition);
      }
      if (p.playerPosition == 2) {
        newPlayer = new Player(this.game, 'player3', position.x, position.y, p.socketId, p.playerPosition);
      }
      if (p.playerPosition == 3) {
        newPlayer = new Player(this.game, 'player4', position.x, position.y, p.socketId, p.playerPosition);
      }

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
        console.log(targetMember.playerPosition);

        //Set player with diff sprite
        if (targetMember.playerPosition == 0) {
          this.players.push(new Player(this.game, 'player1', position.x, position.y, targetMember.socketId, targetMember.playerPosition));
        }
        if (targetMember.playerPosition == 1) {
          this.players.push(new Player(this.game, 'player2', position.x, position.y, targetMember.socketId, targetMember.playerPosition));
        }
        if (targetMember.playerPosition == 2) {
          this.players.push(new Player(this.game, 'player3', position.x, position.y, targetMember.socketId, targetMember.playerPosition));
        }
        if (targetMember.playerPosition == 3) {
          this.players.push(new Player(this.game, 'player4', position.x, position.y, targetMember.socketId, targetMember.playerPosition));
        }
        console.log(`Add Player ${targetMember.socketId}.`);
        map.createLayer('foreground');
      }
    }, this);

    // Get Tilemap Info
    let cut1 = this.map.objects.meta.find(o => o.name == 'cut1');
    let cut2 = this.map.objects.meta.find(o => o.name == 'cut2');
    this.cut1Rect = new Phaser.Rectangle(cut1.x, cut1.y, cut1.width, cut1.height);
    this.cut2Rect = new Phaser.Rectangle(cut2.x, cut2.y, cut2.width, cut2.height);

    // Update Score
    this.game.socket.on('updateScore', score => {
      this.score = score;
      console.log(this.score);
    });

    map.createLayer('foreground');

    // Add Key Control Callback
    this.game.input.keyboard.createCursorKeys();
    this.game.input.keyboard.addCallbacks(this, this.keyDone, this.keyUp);

    //Create Food Pool
    this.onions.createMultiple(50, 'onion-1');
    this.tomatos.createMultiple(50, 'tomato');
    this.mushrooms.createMultiple(50, 'mushroom');

    // Graphic
    this.graphics = this.game.add.graphics({ x: 0, y: 0 });

    SocketConnector.syncMenu(this.requirements, (menu) => {
      console.log(menu);
      this.createRequirement(menu.type, menu.idx, menu.hash);
    });

    // this.createRequirement('onion', 0);
    // this.createRequirement('onion', 1);
    // this.createRequirement('onion', 2);
  }

  update() {
    // Update Hook, 整個 State 的邏輯，能乾淨就乾淨

    for (let i = 0; i < this.players.length; i++) {
      this.game.physics.arcade.collide(this.players[i].sprite, this.collisionLayer);

      for (let j = 0; j < this.players.length; j++) {
        if (i != j) {
          this.game.physics.arcade.collide(this.players[i].sprite, this.players[j].sprite);
        }
        else {

        }
      }

    }

    // Ready
    if (!this.isReady) {
      SocketConnector.setReady();
      this.isReady = true;
    }

    // Clear Progress Bar
    if (this.currentCu1ProgressBar && !Phaser.Rectangle.contains(this.cut1Rect, this.player.sprite.x, this.player.sprite.y)) {
      this.currentCu1ProgressBar.pause();
    }

    if (this.currentCu2ProgressBar && !Phaser.Rectangle.contains(this.cut2Rect, this.player.sprite.x, this.player.sprite.y)) {
      this.currentCu2ProgressBar.pause();
    }
  }

  // Miscellaneous Callback Definition
  // method 定義方法很簡單
  keyDone(event) {
    let { key } = event;

    if (key === 'ArrowLeft') this.player.moveLeft();
    else if (key === 'ArrowRight') this.player.moveRight();
    else if (key === 'ArrowDown') this.player.moveDown();
    else if (key === 'ArrowUp') this.player.moveUp();

    if (key === 'x') {
      // Net
      game.socket.emit('updateSprite', {}, 'press X');
    }
    if (key === ' ') console.log();
  }

  keyUp(event) {
    let { key } = event;
    let { keyboard } = this.game.input;
    let { KeyCode } = Phaser;

    if (!keyboard.isDown(KeyCode.RIGHT) && !keyboard.isDown(KeyCode.LEFT)) this.player.cleanVelocityX();
    if (!keyboard.isDown(KeyCode.UP) && !keyboard.isDown(KeyCode.DOWN)) this.player.cleanVelocityY();
    if (key === ' ') console.log();
  }

  syncUpCallback(idx, controlMes, target) {
    if (controlMes === 'go Left') {
      target.sprite.animations.play('left');
    } else if (controlMes === 'go Right') {
      target.sprite.animations.play('right');
    } else if (controlMes === 'go Up') {
      target.sprite.animations.play('up');
    } else if (controlMes === 'go Down') {
      target.sprite.animations.play('down');
    } else if (controlMes === 'stop X') {
      target.sprite.animations.stop(null, true);
    } else if (controlMes === 'stop Y') {
      target.sprite.animations.stop(null, true);
    } else if (controlMes === 'press X') {
      // Press X
      if (Phaser.Rectangle.contains(this.cut1Rect, target.sprite.x, target.sprite.y)) {
        if (this.currentCu1ProgressBar != null) {
          this.currentCu1ProgressBar.timer.resume();
        } else {
          this.currentCu1ProgressBar = new ProgressBar(this.game, 330, WindowHeight - 60, 100, 15, 50, 100, () => { this.currentCu1ProgressBar = null }, this);
        }
      }
      if (Phaser.Rectangle.contains(this.cut2Rect, target.sprite.x, target.sprite.y)) {
        if (this.currentCu2ProgressBar != null) {
          this.currentCu2ProgressBar.timer.resume();
        } else {
          this.currentCu2ProgressBar = new ProgressBar(this.game, 540, WindowHeight - 60, 100, 15, 50, 100, () => { this.currentCu2ProgressBar = null }, this);
        }
      }
    }
  }

  // Add Requirement
  createRequirement(type, idx, hash) {
    this.requirements.push(new MenuRequirement(this.game, idx, type, hash));
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
