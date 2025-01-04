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
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  let users = [];
  let messages = [];

  io.on('connection', (socket) => {
    const { userId } = socket.handshake.query;

    console.log(`User connected: userId=${userId}, socketId=${socket.id}`);

    // Add the user to the list
    users.push({ userId, socketId: socket.id });

    // Send initial data
    socket.emit('welcome', { id: userId });
    socket.emit('loadMessages', messages);

    // Broadcast updated user list
    io.emit('userList', users.map((user) => ({ userId: user.userId, socketId: user.socketId })));

    // Handle disconnection
    socket.on('disconnect', () => {
      users = users.filter((user) => user.socketId !== socket.id);
      io.emit('userList', users.map((user) => ({ userId: user.userId, socketId: user.socketId })));
      console.log(`User disconnected: userId=${userId}`);
    });

    // Handle direct messages
    socket.on('directMessage', ({ text, from, to }) => {
      const message = { text, from, to, timestamp: new Date() };
      messages.push(message);

      // Send message to recipient
      const recipient = users.find((user) => user.userId === to);
      if (recipient) {
        io.to(recipient.socketId).emit('newDirectMessage', message);
      }

      console.log(`Message from ${from} to ${to}: ${text}`);
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on port ${port}`);
  });
});
