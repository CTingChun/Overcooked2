// Connector V2.0
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
      Object.assign(target.sprite, payload);
    })

    // Add updatePlayerSpriteBody
    game.socket.on('updatePlayerSpriteBody', (payload, socketId) => {
      // Find Player
      let target = players.find(player => player.socketId === socketId);

      // Update Sprite
      Object.assign(target.sprite.body, payload);
    })
  }

  static removeSync() {
    game.socket.removeAllListeners('updatePlayerSprite');
    game.socket.removeAllListeners('updatePlayerSpriteBody');
  }
}