// Room Class For Handling All Game Logic Issue And Other Issue.
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
    this.clients.push({
      name,
      socketId: socket.id,
      isReady: false
    });

    // Add Set Ready
    socket.on('setReady', (isReady=true, fn) => {
      this.clients.find(c => c.socketId === socket.id).isReady = isReady;
      fn('OK');
    });

    // Update Sprite
    socket.on('updateSprite', (payload) => {
      this.room.emit('updatePlayerSprite', payload, socket.id);
    });

    // Update Sprite Body
    socket.on('updateSpriteBody', (payload) => {
      this.room.emit('updatePlayerSpriteBody', payload, socket.id);
    });

    // Get Room Players Info
    socket.on('getPlayersInfo', (fn) => {
      // Return Info.
      fn(this.clients);
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

    // Delete Member
    let idx = this.clients.findIndex(e => e.socketId === socket.id);
    if (idx > -1) this.clients.splice(idx, 1);

    // Remove setReady Event
    socket.removeAllListeners('setReady');
    socket.removeAllListeners('updateSprite');
    socket.removeAllListeners('updateSpriteBody');

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
        isReady: e.isReady
      }
    });

    // Emit Event
    this.room.emit('updateRoom', payload);
  }
}

module.exports = Room;