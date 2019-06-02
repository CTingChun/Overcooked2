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

    // Socket In Room
    this.clients = [];
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
      socketId: socket.id,
      name
    });

    // Emit To Room Member
    this.updateRoomInfo();
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

    // Update Room Info
    this.updateRoomInfo();
  }

  // Private
  updateRoomInfo() {
    // Construct Payload
    let payload = {};
    payload.members = this.clients.map(e => {
      name: e.name
    });

    // Emit Event
    this.room.emit('updateRoom', payload);
  }
}

module.exports = Room;