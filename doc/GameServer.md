# Game Server Doc 伺服器文件

## Socket IO 相關細節

1. 使用 memory-based 的模式

## Feature Detail 設計細節

### Group 機制

運作機制：
- 每個使用者一進遊戲會需要先輸入名字，輸入完後會 Connect 到大廳( `Namespace: Hall` )
- 使用者可以創建 Room，創建完會顯現在群組列表裡，各個使用者都可以加入( `Namespace: Hall, RoomID` )，有人數限制(4 人)

Class 分類：
- `Class: Hall`: 記錄目前有哪些房間，負責對 Client 做所有資料更新
- `Class: Room`: 單一 Room 資料記錄、操作

### Player 更新

## Implementation Doc 開發文件

### Class: Hall

#### On: createRoom

使用者可以透過 emit **createRoom** 向 Server 請求創建一個房間。使用者需傳送**房間名稱**，並在 emit 中傳入 ACK Call Back 作為成功與否的確認

```js
// fn 中 message 會是 Server 回傳的確認訊息
socket.emit('createRoom', '[RoomName房間名稱], fn(message)');
```

- 成功訊息：Room Successfully Created
- 重複訊息：Duplicate Room Name
- 錯誤訊息：Server Internal Error

## Version History