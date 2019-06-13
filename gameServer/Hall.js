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
      // Get Rooms List
      client.on('getRooms', (fn) => {
        // Create Payload
        let payload = this.rooms.map(r => {
          return {
            name: r.name,
            clientNumbers: r.currentClientNumber
          };
        });
        fn(payload);
      })

      // Create Room Event
      client.on('createRoom', (roomName, clientName, fn) => {
        let success = this.createRoom(client, clientName, roomName);

        // Return To Client
        if (success === 0) fn('Room Successfully Created');
        else if (success === 1) fn('Duplicate Room Name');
        else fn('Server Internal Error');

        this.updateHall();
      });

      // Join Room
      client.on('joinRoom', (roomName, clientName, fn) => {
        let success = this.joinRoom(client, clientName, roomName);

        // Return to Client
        if (success === 0) fn('Successfully Join Room');
        else if (success === 1) fn('Room Not Exist');
        else if (success === 2) fn('Already In Room');
        else if (success === 3) fn('Room is full');
        else fn('Server Internal Error');
      });

      // Leave Room
      client.on('leaveRoom', (fn) => {
        let success = this.leaveRoom(client);

        // Return to Client
        if (success === 0) fn('Successfully Leave Room');
        else if (success === 1) fn('Client Not In Any Room');
      })

      // Disconnect Clear Up
      client.on('disconnect', () => {
      })
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

    // 確認是否還有空間
    if (room.clients.length >= 4) return 3;

    // 加入房間
    room.joinRoom(socket, clientName);
    Util.logger(`Socket ${socket.id} join room ${roomName}`);
    return 0;
  }

  /**
   * @private
   */
  leaveRoom(socket) {
    // 先尋找 Client 是在哪個 Room，順便確認是否真的有在任一群組中
    let roomIdx = this.rooms.findIndex(r => r.isInRoom(socket));

    // Client Not In Any Room.
    if (roomIdx === -1) return 1;

    let room = this.rooms[roomIdx];

    // 離開房間
    let remainClientNumber = room.leaveRoom(socket);

    // 確認是否刪除房間，並更新大廳資訊
    if (remainClientNumber === 0) {
      this.rooms.splice(roomIdx, 1);
      this.updateHall();
    }

    return 0;
  }

  /**
   * @private
   */
  updateHall() {
    // 整理 Payload
    let payload = this.rooms.map(r => r.name);
    this.io.emit('updateHall', payload);
  }
}

module.exports = Hall;