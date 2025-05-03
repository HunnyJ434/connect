const express = require('express');
const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'https://connect-ashen-three.vercel.app/anonychat', // Change to your frontend URL
      methods: ['GET', 'POST'],
    },
  });

  let users = [];
  let messages = [];

  // Helper functions
  const broadcastUserList = () => {
    io.emit('userList', users.map((user) => ({ userId: user.userId, socketId: user.socketId })));
  };

  const findUserById = (userId) => users.find((user) => user.userId === userId);

  io.on('connection', (socket) => {
    const { userId } = socket.handshake.query;

    if (!userId) {
      console.error('Connection attempted without userId');
      socket.disconnect(true);
      return;
    }

    console.log(`User connected: userId=${userId}, socketId=${socket.id}`);

    // Add the user to the list
    users.push({ userId, socketId: socket.id });

    // Send initial data to the connected user
    socket.emit('welcome', { id: userId });
    socket.emit('loadMessages', messages);

    // Broadcast the updated user list to all clients
    broadcastUserList();

    // Handle user disconnection
    socket.on('disconnect', () => {
      users = users.filter((user) => user.socketId !== socket.id);
      broadcastUserList();
      console.log(`User disconnected: userId=${userId}`);
    });

    // Handle direct messages
    socket.on('directMessage', ({ text, from, to }) => {
      if (!text || !from || !to) {
        console.error('Invalid message data received');
        return;
      }

      const message = {
        text,
        from,
        to,
        timestamp: new Date(),
      };
      messages.push(message);

      const recipient = findUserById(to);

      if (recipient) {
        io.to(recipient.socketId).emit('newDirectMessage', message);
        console.log(`Message from ${from} to ${to}: ${text}`);
      } else {
        console.warn(`Message to ${to} failed: User not connected`);
      }
    });
  });

  // Handle all other HTTP requests
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  httpServer.listen(port, '0.0.0.0', () => {  // Listen on all IPs for external access
    console.log(`> Ready on port ${port}`);
  });
});
