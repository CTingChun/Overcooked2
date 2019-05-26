// Connector Class
class Connector extends ConnectBase {
  /** 
    Construct A Connect
    @constructor
    @param { String } roomId, 房間 ID，用在辨別 DB 位置
    @param { String } playerId, 玩家獨有 ID，用在辨別 DB 位置
  */
  constructor(roomId, playerId) {
    super();

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
    custom[Key]Proxy: proxy
  */
  addToDB(key, object, type='sprite') {
    let func = async (res, rej) => {
      // 1-1 Remove Previous Event Handler If exist on Object.
      if (typeof object.dbEventListner !== 'undefined') object.dbEventListner();

      // 1-2 Revoke Previous Add Proxy If exist on Object.
      if (typeof object[`custom${key}Proxy`] !== 'undefined') this.removePreviousAddedProxy(key, object);

      // 1-3 Create Proxy Object.
      object[`custom${key}Proxy`] = Proxy.revocable(object, new ProxyHandler(null, `custom${key}Proxy`, type));

      // 1-4 Create DB Data Structure.
      // 1-5 Add DB Event Handler (Use Original Object to Avoid Loop Update).
      // 1-6 Resolve and return proxy.
      res(object[`custom${key}Proxy`].proxy);
    };
    return new Promise(func);
  }

  // Private
  /**
   * @private
   * @param { String } key, Name Of Key
   * @param { * } object 
   */
  removePreviousAddedProxy(key, object) {
    for (let prop in object) {
      // 1-1 Filter Out Property In Prototype. 
      if (object.hasOwnProperty(prop)) {
        // 2-1 Check If Is Object and not a Array and not proxy object
        if (typeof object[prop] === 'object' && ! Array.isArray(object[prop]) && prop !== `custom${key}Proxy`) {
          this.removePreviousAddedProxy(key, object[prop]);
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
