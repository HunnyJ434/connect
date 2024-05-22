const express = require('express');
const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Adjust according to your security needs
      methods: ["GET", "POST"]
    }
  });

  let users = [];  // This will store user IDs with their socket IDs
  let messages = []; // This will store messages

  io.on('connection', (socket) => {
    // Assign a random ID when a user connects
    const userId = Math.floor(Math.random() * 10000);
    users.push({ id: userId, socketId: socket.id });

    // Emit the welcome message and current messages to the new user
    socket.emit('welcome', { id: userId });
    socket.emit('loadMessages', messages);

    // Emit the updated user list to all clients
    io.emit('userList', users.map(user => ({ id: user.id })));

    socket.on('disconnect', () => {
      users = users.filter(user => user.socketId !== socket.id); // Remove user on disconnect
      io.emit('userList', users.map(user => ({ id: user.id }))); // Update all clients
      console.log(`User with ID ${userId} disconnected`);
    });

    // Handle direct messages
    socket.on('directMessage', ({ text, from, to }) => {
      const message = {
        id: messages.length + 1,
        text,
        from,
        to,
        timestamp: new Date(),
      };
      messages.push(message);

      // Find the recipient's socket
      const recipient = users.find(user => user.id === to);
      if (recipient) {
        io.to(recipient.socketId).emit('newDirectMessage', message);
      }

      // Also notify the sender (for confirmation or UI updates)
      socket.emit('newDirectMessage', message);
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});