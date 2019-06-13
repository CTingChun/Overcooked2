# Game Server Doc 伺服器文件

## 本機端啟用方法

```sh
# 切換到 server 資料夾
cd gameServer

# 安裝 npm 相關套件
npm install

# 啟動 Server
npm run serve
```

## Socket IO 相關細節

1. 使用 memory-based 的模式

## Feature Detail 設計細節

### Group 機制

運作機制：
- ~~每個使用者一進遊戲會需要先輸入名字，輸入完後會 Connect 到大廳( `Namespace: Hall` )~~
- 使用者可以創建 Room，創建完會顯現在群組列表裡，各個使用者都可以加入( `Namespace: Hall, RoomName` )，有人數限制(4 人)

Class 分類：
- `Class: Hall`: 記錄目前有哪些房間，負責對 Client 做所有資料更新
- `Class: Room`: 單一 Room 資料記錄、操作

### Player 更新

運作機制：

## Implementation Doc 開發文件 (In Server's Perspective)

### Class: Hall

#### On: createRoom

使用者可以透過 emit **createRoom** 向 Server 請求創建一個房間。使用者需傳送**房間名稱**和**使用者輸入的名稱**，並在 emit 中傳入 ACK Call Back 作為成功與否的確認

```js
// fn 中 message 會是 Server 回傳的確認訊息
socket.emit('createRoom', '[RoomName房間名稱]', '[ClientName使用者名稱]' mes => { ... });
```

- 成功訊息：Room Successfully Created
- 重複訊息：Duplicate Room Name
- 錯誤訊息：Server Internal Error

使用者成功加入後，Server 會發出 [updateHall](#emit-updatehall) 事件

#### On: joinRoom

使用者可以透過 emit **joinRoom** 向 Server 請求加入一個房間。使用者需傳送**房間名稱**和**使用者輸入的名稱**，並在 emit 中傳入 ACK Call Back 作為成功與否的確認

```js
// fn 中 message 會是 Server 回傳的確認訊息
socket.emit('joinRoom', '[RoomName房間名稱]', '[ClientName使用者名稱]', mes => { ... });
```

- 成功訊息：Successfully Join Room
- 重複訊息：Already In Room
- 房間不存在：Room Not Exist
- 錯誤訊息：Server Internal Error

使用者成功加入後，Server 會發出 [updateRoom](#emit-updateroom) 事件

#### On: leaveRoom

使用者可以透過 emit **joinRoom** 向 Server 請求加入一個房間。使用者不需傳送**任何東西**，但需要在 emit 中傳入 ACK Call Back 作為成功與否的確認

```js
// fn 中 message 會是 Server 回傳的確認訊息
socket.emit('leaveRoom', mes => { ... });
```

- 成功訊息：Successfully Leave Room
- 未加入房間訊息：Client Not In Any Room

使用者成功加入後，Server 會發出 [updateRoom](#emit-updateroom) 事件

#### Emit: updateHall

當以下 Event 被觸發時：

- [createRoom](#on-createroom)

Server 會 emit 一個訊息給大廳裡所有使用者，訊息內容格式為

```js
// Server 回傳資料格式
[
  '房間名稱1',
  '房間名稱2',
  ...
]

// 前端接收
socket.on('updateHall', payload => { ... });
```

### Class: Room

#### Emit: updateRoom

當以下 Event 被觸發時：

- [joinRoom](#on-joinroom)

Server 會 emit 一個訊息給房間內所有使用者，訊息內容格式為

```js
// Server 回傳資料格式
{
  members: [{
    name: "[member's name]"
  }, ...]
}

// 前端接收
socket.on('updateRoom', payload => { ... });
```

## Version History