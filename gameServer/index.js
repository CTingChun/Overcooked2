// Server Entry Point.
var Hall = require('./Hall');
var Room = require('./Room');

// Create A Server
var io = require('socket.io')(8000);

// Middleware

// Create Hall
var hall = new Hall(io.of('Hall'));
