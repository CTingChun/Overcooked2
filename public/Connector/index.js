// Connector Class
class Connector {
  /** 
    Construct A Connect
    @constructor
    @param { String } roomId, 房間 ID，用在辨別 DB 位置
    @param { String } playerId, 玩家獨有 ID，用在辨別 DB 位置
  */
  constructor(roomId, playerId) {
    this.roomId = roomId;
    this.playerId = playerId;
  }

  // Public Function
  /**
    @name addToDB
    @param { String } key, 用在 DB 路徑
    @param { Phaser.Sprite, Any } object, 任何要記錄的物件
    @return { Proxy }, 之前透過 object 傳進來 object 建成的的 Proxy 物件
  */
  addToDB(key, object, type="Sprite") {
    // 1-1 Remove Previous Event Handler If exist on Object.
    // 1-2 Create Proxy Object.
    // 1-3 Add DB Event Handler (Use Original Object to Avoid Loop Update).
  }
}
