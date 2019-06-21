// Room Class For Handling All Game Logic Issue And Other Issue.
// Random String
const RandStr = require('crypto-random-string');

// Util Function
var Util = require('./util');

class Room {
  /**
   * @constructor
   * @param { SocketIO.Namespace } io 
   * @param { String } name 
   */
  constructor(io, name) {
    // Setting
    this.name = name;
    this.room = io.to(this.name);
    this.isPlaying = false;

    // Socket In Room
    this.clients = [];

    // Vegetables
    this.onions = [];

    // Room Player Slot
    this.roomPlayerSlot = [false, false, false, false];
  }
  // Getter
  get currentClientNumber() {
    return this.clients.length;
  }
  
  // Public Function
  /**
   * @public
   * @param { SocketIO.Socket } socket 
   * @param { String } name
   */
  joinRoom(socket, name) {
    // Join Room
    socket.join(this.name);

    // Prepare Player Slot
    let playerSlot = this.roomPlayerSlot.findIndex(isOccupied => !isOccupied);
    this.roomPlayerSlot[playerSlot] = true;

    this.clients.push({
      name,
      socketId: socket.id,
      isReady: false,
      playerPosition: String(playerSlot)
    });

    // Add Set Ready
    socket.on('setReady', (isReady=true, fn) => {
      this.clients.find(c => c.socketId === socket.id).isReady = isReady;
      fn('OK');
    });

    // Update Sprite
    socket.on('updateSprite', (payload, controlMes) => {
      this.room.emit('updatePlayerSprite', payload, socket.id, controlMes);
    });

    // Update Sprite Body
    socket.on('updateSpriteBody', (payload, controlMes) => {
      this.room.emit('updatePlayerSpriteBody', payload, socket.id, controlMes);
    });

    // Get Room Players Info
    socket.on('getPlayersInfo', (fn) => {
      // Return Info.
      fn(this.clients);
    });

    // Get Onions Info
    socket.on('getVegetableInfo', (type, fn) => {
      // Return Onion Info
      if (type === 'onion') {

        fn(this.onions);

      } else {
        
        Util.logger('Not Supported Vegetable Type.', true);

      }
    });

    // Add Vegetable
    socket.on('addVegetable', (type, payload) => {
      // add Onion Info
      if (type === 'onion') {

        // Payload Should Have Following Structure
        // {
        //   x: (InitX),
        //   y: (InitY),
        //   hashString: 'dafed...'
        // }
        let { x, y } = payload;

        this.onions.push({
          x,
          y,
          hash: RandStr({ length: 12 })
        });

        // Update To Client
        this.room.emit('updateVegetable', 'onion', this.onions);

        Util.logger('Onion Added.')

      } else {
        
        Util.logger('Not Supported Vegetable Type.', true);

      }
    });

    // Remove Vegetable
    socket.on('removeVegetable', (type, hash) => {
      // Remove Onion
      if (type === 'onion') {

        let idx = this.onions.findIndex(o => o.hash === hash);

        if (idx > -1) {
          this.onions.splice(idx, 1);
        }

        // Update To Client
        this.room.emit('updateVegetable', 'onion', this.onions);

      } else {
        
        Util.logger('Not Supported Vegetable Type.', true);

      }
    })

    // Emit To Room Member
    this.updateRoomInfo();

    // Return Client Numbers
    return this.clients.length;
  }
  /**
   * @public
   * @param { SocketIO.Socket } socket 
   */
  leaveRoom(socket) {
    // Leave Room
    socket.leave(this.name);

    let idx = this.clients.findIndex(e => e.socketId === socket.id);

    // Delete Member and Free Player Slot
    if (idx > -1) {
      this.roomPlayerSlot[Number(this.clients[idx].playerPosition)] = false;
      this.clients.splice(idx, 1);
    }

    // Remove Event
    socket.removeAllListeners('setReady');
    socket.removeAllListeners('updateSprite');
    socket.removeAllListeners('updateSpriteBody');
    socket.removeAllListeners('getPlayersInfo');
    socket.removeAllListeners('getOnionsInfo');

    // Update Room Info
    this.updateRoomInfo();

    // Return Client Numbers
    return this.clients.length;
  }

  /**
   * 
   * @param { SocketIO.Socket } socket 
   */
  isInRoom(socket) {
    let idx = this.clients.findIndex(e => e.socketId === socket.id);
    return idx > -1;
  }

  // Private
  updateRoomInfo() {
    // Construct Payload
    let payload = {};
    payload.members = this.clients.map(e => {
      return {
        name: e.name,
        isReady: e.isReady,
        socketId: e.socketId,
        playerPosition: e.playerPosition
      }
    });

    // Emit Event
    this.room.emit('updateRoom', payload);
  }
}

module.exports = Room;