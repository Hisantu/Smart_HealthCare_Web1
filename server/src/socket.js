// server/src/socket.js
const { Server } = require('socket.io');

function initSockets(server) {
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // simple join room by dept or display
    socket.on('join', (room) => {
      socket.join(room);
    });

    socket.on('leave', (room) => {
      socket.leave(room);
    });

    socket.on('disconnect', () => {
      // console.log('disconnected', socket.id);
    });
  });

  return io;
}

module.exports = { initSockets };
