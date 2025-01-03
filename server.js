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
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',  // Adjust to your frontend URL
      methods: ["GET", "POST"]
    }
  });

  let users = [];
  let messages = [];

  io.on('connection', (socket) => {
    const { userId } = socket.handshake.query;  // Get the anonymous user ID from the query
    console.log(`Anonymous user connected with userId: ${userId}, socket id: ${socket.id}`);

    users.push({ userId, socketId: socket.id });

    socket.emit('welcome', { id: userId });
    socket.emit('loadMessages', messages);
    io.emit('userList', users);

    socket.on('disconnect', () => {
      users = users.filter(user => user.socketId !== socket.id);
      io.emit('userList', users);
      console.log(`Anonymous user with userId: ${userId} disconnected`);
    });

    socket.on('directMessage', ({ text, from, to }) => {
      const message = { text, from, to, timestamp: new Date() };
      messages.push(message);

      const recipient = users.find(user => user.userId === to);  // Find recipient by userId
      if (recipient) {
        io.to(recipient.socketId).emit('newDirectMessage', message);  // Send message to recipient
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
