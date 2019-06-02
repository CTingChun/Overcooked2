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
      client.on('createRoom', (roomName, fn) => {
        let success = this.createRoom(client, roomName);

        // Return To Client
        if (success === 0) fn('Room Successfully Created');
        else if (success === 1) fn('Duplicate Room Name');
        else fn('Server Internal Error');
      });


    });
  }
  // Various Callback
  createRoom(socket, roomName) {
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
      this.io.emit('roomCreated', {
        name: roomName
      });

      // Client Join
      newRoom.joinRoom(socket, roomName);

      Util.logger(`Client Create Room: ${roomName}`);
      return 0;
    } catch(err) {
      console.error(err);
      return -1;
    }
  }
}

module.exports = Hall;