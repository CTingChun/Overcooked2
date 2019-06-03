// Hall Class For Handling All Client Hall Data Update
// Util Function
var Util = require('./util');

// Room Class
var Room = require('./Room');

class Hall {
  /**
   * @constructor
   * @param { SocketIO.Namespace } io 
   */
  constructor(io) {
    // Add Namespace Reference
    this.io = io;
    
    // Rooms
    this.rooms = [];

    // Add Connect Event (Socket.io)
    this.io.on('connect', (client) => {
      // Create Room Event
      client.on('createRoom', (roomName, clientName, fn) => {
        let success = this.createRoom(client, clientName, roomName);

        // Return To Client
        if (success === 0) fn('Room Successfully Created');
        else if (success === 1) fn('Duplicate Room Name');
        else fn('Server Internal Error');

        // 整理 Payload
        let payload = this.rooms.map(r => r.name);
        this.io.emit('updateHall', payload);
      });

      // Join Room
      client.on('joinRoom', (roomName, clientName, fn) => {
        let success = this.joinRoom(client, clientName, roomName);

        // Return to Client
        if (success === 0) fn('Successfully Join Room');
        else if (success === 1) fn('Room Not Exist');
        else if (success === 2) fn('Already In Room');
        else fn('Server Internal Error');
      });
    });
  }

  // Various Callback
  /**
   * @private
   * @param { SocketIO.Socket } socket 
   * @param { String } clientName
   * @param { String } roomName 
   */
  createRoom(socket, clientName, roomName) {
    try {
      // Check If Room Exist
      if (this.rooms.findIndex(r => r.name === roomName) > -1) {
        Util.logger(`Room Duplicated: ${roomName}`);
        return 1;
      }

      // Create Room
      let newRoom = new Room(this.io, roomName);

      // Add to record and emit to all client
      this.rooms.push(newRoom);

      // Client Join
      newRoom.joinRoom(socket, clientName);

      Util.logger(`Client Create Room: ${roomName}`);
      return 0;
    } catch(err) {
      console.error(err);
      return -1;
    }
  }

  /**
   * @private
   * @param { SocketIO.Socket } socket 
   * @param { String } clientName
   * @param { String } roomName 
   */
  joinRoom(socket, clientName, roomName) {
    // 確認有無此房間
    let room = this.rooms.find(r => r.name === roomName);
    if (!room) {
      Util.logger(`Room ${roomName} not exist.`);
      return 1;
    }

    // 確認是否已在房間中
    if (room.isInRoom(socket)) return 2;

    // 加入房間
    room.joinRoom(socket, clientName);
    Util.logger(`Socket ${socket.id} join room ${roomName}`);
    return 0;
  }
}

module.exports = Hall;