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
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  let users = [];
  let messages = [];

  io.on('connection', (socket) => {
    const userId = Math.floor(Math.random() * 10000);
    users.push({ id: userId, socketId: socket.id });

    console.log(`User connected: ${userId}, socket id: ${socket.id}`);
    console.log('Current users:', users);

    socket.emit('welcome', { id: userId });
    socket.emit('loadMessages', messages);
    io.emit('userList', users.map(user => ({ id: user.id })));

    socket.on('disconnect', () => {
      users = users.filter(user => user.socketId !== socket.id);
      io.emit('userList', users.map(user => ({ id: user.id })));
      console.log(`User with ID ${userId} disconnected, socket id: ${socket.id}`);
      console.log('Current users:', users);
    });

    socket.on('directMessage', ({ text, from, to }) => {
      const message = {
        id: messages.length + 1,
        text,
        from,
        to,
        timestamp: new Date(),
      };
      messages.push(message);

      const recipient = users.find(user => user.id === to);
      if (recipient) {
        io.to(recipient.socketId).emit('newDirectMessage', message);
      }

      socket.emit('newDirectMessage', message);
      console.log(`Message from ${from} to ${to}: ${text}`);
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
