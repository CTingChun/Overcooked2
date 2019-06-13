# 軟實 Final Project 計畫

## 開發流程

- 可以直接使用 Firefox，想用 Chrome 可以先 npm install，然後再打 npm run serve，點開裡面寫的網址(記得在 Chrome dev tool 裡的 network 打開 `Disable cache`)

![Disable Cache](images/disable-cache.png)

- 只要有人更新時，可以打以下指令做更新
```zsh
# 懶得打指令也可以用 vscode 做到
# 先把目前做的東西變成一個 commit
git add .;
git commit -m "[message]";

# 切換到 dev 更新
git checkout dev;
git pull;

# 切回自己的 branch (以君君的 branch 為例，改成自己的 branch)
git checkout claire;
git merge --no-ff dev;

# 然後接下來退出 vim 的方法：Shift + :鍵
```

## Game Flow 遊戲流程

整體遊戲相關進程，根據 Phaser 特性([State](https://photonstorm.github.io/phaser-ce/Phaser.State.html))來定義遊戲進程。

### High Risk 高風險

必須要有的東西

| Game State 遊戲階段 | Content 階段內容                | Developer 開發者 |
| ----------------- | ----------------------------- | --------------- |
| Menu              | 開始頁面的圖像、Position、UI 設計  |                 |
| Tutorial          | 設計教學頁面，page 設計           |                 |
| MainGame          | 主要遊戲內容，定義了全部遊戲邏輯      |                 |
| EndGameMenu       | 結束頁面的圖像、Position、UI 設計   |                |

### High Value 高價值

做了應該會更乾淨，更高級的 State.

| Game State 遊戲階段 | Content 階段內容                                  | Developer 開發者 |
| ----------------- | ----------------------------------------------- | --------------- |
| Pause Menu        | 暫停畫面直接切出去一個 State, 要做 State 間資訊紀錄和轉移 ||

## 各個 State 功能列表

下面會列出每個 State 裡該有的功能，以及其功能細部需求。以功能分類

### 設定

視窗大小：1280 * 720

### Main Game 遊戲主體邏輯

#### 多人連線模組

- Main Requirement: 主要要能記錄各個遊戲物件現在的資料為何，並且在有新資料進來時更新到本機端。
- Implementation: 有一個連接器，可以加入 firebase realtime update，並且在物件刪除時一並刪除 Callback
- Input: Js 物件建構，只是一個控制器，各個 Function 獨立
- Implementation Detail: Below

#### Connector V2.0 (Functionality Implemented With SocketIO)

##### 使用方法 使いの方

有個全遇的 Class 叫 `SocketConnector`，使用方法即是對著他呼叫函式，例如：
```js
// 呼叫 Update 自己 Player Sprite 裡的變數
SocketConnector.updatePlayerSprite(payload);
```

整套使用方法如下:
```js
// 以下 Code 不要直接用抄的，因為這類似 pseudo code，比如說我寫 await 代表說他回傳是一個 Promise，要馬你可以用 then(res => { ... }) 拿到資料，或是用 async/await function 像下面一樣拿到資料

// 首先，要先加入一個房間，加入房間時前端要提供 1. 要加入的房間名稱 2. 玩家名稱
// 取回現有房間訊息的方法
let roomsInfo = await SocketConnector.getRoomsInfo();

// 拿到資訊後，可以開始加入房間（回傳訊息格式可以按下面連結）
let message = await SocketConnector.joinRoom(roomsInfo.name, '[玩家自定義名稱]');

// 也可以來開房間
let message = await SocketConnector.leaveRoom();

// 當然也可以自己創建房間（一樣訊息格式可以按下面）
let message = await SocketConnector.createRoom('[玩家自定義房間名稱]', '[玩家自定義名稱]')

// 接下來如果開始做同步更新 Player 的功能時，可以這樣做
let playersInfo = await SocketConnector.getPlayersInfo();

// 回傳的格式是一個陣列，裡面每個 Object 都包含以下訊息

{
  name: '[玩家當初輸入名稱]',
  socketId: socket.id,    // 這個很重要，是每個 Player Socket 的 ID
  isReady: false
}

// 有了 PlayersInfo 就可以開始產生 Player 陣列
// 每個 Player 裡面一定要有二個 Property，分別是 this.sprite 用來指向最初 Phaser.Sprite 的物件，和 this.socketId，存入剛剛拿回來的 SocketId。這兩個東西我的 Code 裡面會用到

// 產生 Player
playerList = playersInfo.map(info => {
  // 當然這邊都可以自己定義，看是要用 Constructor, 還是後面再加都可以
  return new Player(socketId);
})

// 有了 List 以後要做註冊 Syncup 的動作
SocketConnector.syncAllSocket(playerList);

// 接下來就可以開始發送更新啦
// 目前我只有做兩種，分別是對整個 Sprite 的更新：
SocketConnector.update('sprite', {
  alpha: 0.9,
  centerX: 100,
  centerY: 138,
  // .... 直接把 Phaser.Sprite 裡可以改的東西包成一個 Object 傳進來
});

// Sprite 裡 Body 的更新
SocketConnector.update('spriteBody', {
  x: 124,
  y: 124,
  // .... 直接把 Phaser.Sprite 裡 Body 可以改的東西包成一個 Object 傳進來
});
```

可以用 Command + 滑鼠對著連結點擊(Mac) / Control + 滑鼠對著連結點擊(Windows) 切到文件位置
- [JoinRoom 回傳訊息格式連結](./GameServer.md#on-joinroom)
- [CreateRoom 回傳訊息格式點節](./GameServer.md#on-createroom)

#### Connector V1.0 (Functionality Implemented With Firebase)

##### DB 路徑定義

|- rooms(collection)
|---- [room_id](doc)
|------- game
|---------- To be Added.
|------- player-[playerId] (collection)
|---------- character(doc)
|------- player-[playerId] (collection)
|---------- character(doc)

##### Class 物件定義

```js
// 物件定義
class Connector {
  /** 
    Construct A Connect
    @constructor
    @param { String } roomId, 房間 ID，用在辨別 DB 位置
    @param { String } playerId, 玩家獨有 ID，用在辨別 DB 位置
  */
  constructor(roomId, playerId) {
    // ....
  }
}

// 產生物件
let connector = new Connector('[roomId]', '[playerId]');
```

##### createRoom()

```js
/** 
 * @return { Promise, String } roomId
*/
static function createRoom()
```

##### addToDB()

```js
/**
  @name addToDB
  @param { String } key, 用在 DB 路徑
  @param { Phaser.Sprite, Any } object, 任何要記錄的物件
  @return { Promise, Proxy }, 之前透過 object 傳進來的物件的 Proxy
*/
function addToDB(key, object);
```

##### removeLinkToDB

```js
/**
  * @name removeLinkToDB
  * @param { String } key 
  * @param { Object } originalObject 
*/
function removeLinkToDB(key, originalObject);
```

## 相關文件連結

- [Phaser CE 官方文件](https://photonstorm.github.io/phaser-ce/)
- [Git 常用指令文件](http://gitqwerty777.github.io/git-commands/)
- [Socket.io](https://socket.io/)