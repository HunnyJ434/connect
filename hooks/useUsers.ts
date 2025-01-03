import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

export interface User {
  id: number;
}

let socket: Socket | null = null;

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!socket) {
      console.log('Initializing WebSocket connection');
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'https://secure-springs-34120-c35181257eb9.herokuapp.com/', {
        path: '/socket.io',
        transports: ['websocket'],
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

      socket.on('error', (error) => {
        console.error('Socket.IO error:', error);
      });
    }

    return () => {
      if (socket) {
        console.log('Cleaning up WebSocket connection');
        socket.off('welcome');
        socket.off('userList');
        socket.disconnect();
        socket = null;
        console.log('WebSocket connection closed (component unmount)');
      }
    };
  }, []);

  return { users, setUsers, currentUser, setCurrentUser, socket };
};

export default useUsers;
