const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const { attachSocketAuth, registerChatHandlers } = require('./sockets/chat.socket');
require('dotenv').config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

attachSocketAuth(io);
io.on('connection', (socket) => registerChatHandlers(socket, io));
app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
