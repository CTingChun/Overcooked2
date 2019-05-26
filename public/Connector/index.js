// Connector Class
class Connector extends ConnectBase {
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
    Will Add Two Property on object:
    sendingInfo: Object
    dbEventListener: Listener
  */
  addToDB(key, object, type="Sprite") {
    let func = async (res, rej) => {
      // 1-1 Remove Previous Event Handler If exist on Object.
      // 1-2 Revoke Previous Add Proxy If exist on Object.
      // 1-3 Create Proxy Object.
      // 1-4 Create DB Data Structure.
      // 1-5 Add DB Event Handler (Use Original Object to Avoid Loop Update).
    };
    return new Promise(func);
  }

  // Private
  /**
   * @private
   * @param { * } object 
   */
  removePreviousAddedProxy(key, object) {
    for (let prop in object) {
      // 1-1 Filter Out Property In Prototype. 
      if (object.hasOwnProperty(prop)) {
        // 2-1 Check If Is Object and not a Array
        if (typeof object[prop] === 'object' && ! Array.isArray(object[prop])) {
          this.removePreviousAddedProxy(object[prop]);
        }
      } else {
        continue;
      }
    }

    // 3-1 Revoke Added Proxy
    if (typeof object[`custom${key}Proxy`] !== 'undefined') {
      // 3-2 Revoke Proxy
      object[`custom${key}Proxy`].revoke();

      // Delete Property
      delete object[`custom${key}Proxy`];
    }
  }
}
