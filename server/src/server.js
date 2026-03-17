const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Socket logic will be imported here later
// const registerChatHandlers = require('./sockets/chat.socket');
// io.on('connection', (socket) => registerChatHandlers(socket, io));
