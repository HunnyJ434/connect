import io, { Socket } from 'socket.io-client';
import { useState,useEffect, Key } from 'react';
let socket: Socket | null = null;
export interface User {
  userId: string;
  id: string; // Matches `userId` from the server
  socketId: string;
}

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!socket) {
      console.log('Initializing WebSocket connection');

      const userId = generateUserId(); // Generate or retrieve a unique userId
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://34.133.212.1:3000/' || 'https://nextjs-app-470342216399.us-central1.run.app', {
        path: '/socket.io',
        transports: ['websocket'],
        query: { userId }, // Pass userId here
      });

      socket.on('welcome', (data: User) => {
        setCurrentUser(data);
        console.log(`Welcome user: ${data.id}`);
      });

      socket.on('userList', (data: User[]) => {
        console.log('Received user list:', data);
        setUsers(data);
      });

      socket.on('disconnect', () => {
        console.log('WebSocket connection closed');
      });

      socket.on('connect_error', (error) => {
        console.error('WebSocket connect error:', error);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  const generateUserId = () => {
    // Generate a unique userId (e.g., random number or UUID)
    return Math.floor(Math.random() * 100000).toString();
  };

  return { users, setUsers, currentUser, setCurrentUser, socket };
};

export default useUsers;
