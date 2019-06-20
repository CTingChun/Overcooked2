// Connector V2.0

// 支援監聽 Event 名稱
var EventNameList = [
  'updateHall',
  'updateRoom'
]

class SocketConnector {
  constructor() {}

  // Static Method
  static getRoomsInfo() {
    return new Promise((res, rej) => {
      try {
        game.socket.emit('getRooms', (data) => {
          res(data);
        });
      } catch (err) {
        rej();
      }
    });
  }

  static update(type, payload) {
    if (type === 'sprite') {

      game.socket.emit('updateSprite', payload);

    } else if (type === 'spriteBody') {

      game.socket.emit('updateSpriteBody', payload);

    } else {

      console.error('Not Support Type At SocketConnector.update()')
      
    }
  }

  static createRoom(roomName, clientName) {
    return new Promise((res, rej) => {
      try {
        game.socket.emit('createRoom', roomName, clientName, (mes) => {
          res(mes);
        });
      } catch (err) {
        rej();
      }
    });
  }

  static joinRoom(roomName, clientName) {
    return new Promise((res, rej) => {
      try {
        game.socket.emit('joinRoom', roomName, clientName, (mes) => {
          res(mes);
        });
      } catch (err) {
        rej();
      }
    });
  }

  static leaveRoom(roomName, clientName) {
    return new Promise((res, rej) => {
      try {
        game.socket.emit('leaveRoom', (mes) => {
          res(mes);
        });
      } catch (err) {
        rej();
      }
    });
  }

  static getPlayersInfo() {
    return new Promise((res, rej) => {
      try {
        game.socket.emit('getPlayersInfo', (data) => {
          res(data);
        });
      } catch (err) {
        rej();
      }
    });
  }

  /**
   * 
   * @param { Boolean } isReady 
   */
  static setReady(isReady=true) {
    return new Promise((res, rej) => {
      try {
        game.socket.emit('setReady', isReady, (_) => {
          res();
        })
      } catch (err) {
        rej();
      }
    })
  }

  /**
   * 
   * @param { Array } players, Array Of Player Class
   */
  static syncAllSocket(players) {
    // Add UpdatePlayerSprite
    game.socket.on('updatePlayerSprite', (payload, socketId) => {
      // Find Player
      let target = players.find(player => player.socketId === socketId);

      // Update Sprite
      SocketConnector._recursiveUpdate(target.sprite, payload);
    })

    // Add updatePlayerSpriteBody
    game.socket.on('updatePlayerSpriteBody', (payload, socketId) => {
      // Find Player
      let target = players.find(player => player.socketId === socketId);

      // Update Sprite
      SocketConnector._recursiveUpdate(target.sprite.body, payload);
    })
  }

  /**
   * 
   * @param { String } eventName 
   * @param { Function } callback 
   * @param { Object } context 
   */
  static addEventListner(eventName, callback, context=null) {
    // 確認是否支援此 Event
    if (EventNameList.indexOf(eventName) < 0) {
      console.error(`不支援此事件名稱：${eventName}.`);
      return undefined;
    }

    // 添加 Event 到 Socket 上
    if (context) {
      game.socket.on(eventName, (...Args) => {
        callback.call(context, ...Args);
      });
    } else {
      game.socket.on(eventName, callback);
    }
  }

  static removeSync() {
    game.socket.removeAllListeners('updatePlayerSprite');
    game.socket.removeAllListeners('updatePlayerSpriteBody');
  }

  static _recursiveUpdate(object, payload) {
    // Update Multiple payload
    // 1-1 Get Payload Keys
    let payloadKeys = Object.keys(payload);

    for (let key of payloadKeys) {
      // 1-2 Parse Path
      let path = key.split('.');
      let pathLength = path.length;

      // 1-3 Update Object
      let targetObject = object;
      for (let i = 0; i < pathLength; i++) {
        if (i === pathLength - 1) {
          targetObject[path[i]] = payload[key];
        } else {
          targetObject = targetObject[path[i]];
        }
      }
    }
  }
}