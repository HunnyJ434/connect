'use client';
import { useState, useEffect } from 'react';
import useUsers, { User } from '../hooks/useUsers';
import io from 'socket.io-client';

interface Message {
  id: number;
  text: string;
  from: number;
  to: number;
  timestamp: Date;
}

let socket: any = null;

const Home = () => {
  const { users, setUsers, currentUser, setCurrentUser } = useUsers();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [recipientId, setRecipientId] = useState<number | null>(null);
  const [showMessageWindow, setShowMessageWindow] = useState(false);

  useEffect(() => {
    if (!socket) {
      console.log('Setting up WebSocket in Home component');
      socket = socket = io('https://connect-ashen-three.vercel.app', {
        path: '/socket.io',
        transports: ['websocket'],
      });

      socket.on('welcome', ({ id }: any) => {
        setCurrentUser({ id });
        console.log('Welcome event received:', { id });
      });

      socket.on('loadMessages', (loadedMessages: Message[]) => {
        setMessages(loadedMessages);
        console.log('Loaded messages:', loadedMessages);
      });

      socket.on('newDirectMessage', (message: Message) => {
        setMessages(prevMessages => [...prevMessages, message]);
        console.log('New direct message received:', message);
        if (message.to === currentUser?.id) {
          setRecipientId(message.from);
          setShowMessageWindow(true);
        }
      });

      socket.on('userList', (data: User[]) => {
        console.log('Received user list:', data);
        setUsers(data);
      });

      socket.on('disconnect', () => {
        console.log('WebSocket connection closed');
      });

      socket.on('connect_error', (error: any) => {
        console.error('WebSocket connect error:', error);
      });

      socket.on('error', (error: any) => {
        console.error('Socket.IO error:', error);
      });
    }

    return () => {
      if (socket) {
        console.log('Cleaning up WebSocket connection in Home component');
        socket.off('welcome');
        socket.off('loadMessages');
        socket.off('newDirectMessage');
        socket.off('userList');
        socket.disconnect();
        socket = null;
        console.log('WebSocket connection closed (component unmount)');
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCurrentUser, setUsers]);

  const sendMessage = () => {
    if (currentUser && recipientId && messageText) {
      console.log('Sending direct message:', { text: messageText, from: currentUser.id, to: recipientId });
      socket.emit('directMessage', {
        text: messageText,
        from: currentUser.id,
        to: recipientId,
      });
      setMessageText('');
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-3">User IDs</h1>
      <ul className="list-disc pl-5">
        {users.filter((_, index) => index % 2 !== 0).map(user => (
          <li key={user.id} className="mb-1">
            User ID: {user.id} {user.id === currentUser?.id && '(You)'}
            {user.id !== currentUser?.id && (
              <button
                onClick={() => {
                  setRecipientId(user.id);
                  setShowMessageWindow(true);
                }}
                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
              >
                Message
              </button>
            )}
          </li>
        ))}
      </ul>

      {currentUser && recipientId && showMessageWindow && (
        <div className="mt-5">
          <h2 className="text-lg font-bold mb-3">Send a Message to User {recipientId}</h2>
          <textarea
            placeholder="Message"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="mb-2 p-2 border w-full h-24"
            style={{ color: 'black' }}
          />
          <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded">
            Send Message
          </button>

        </div>
      )}
      {currentUser &&( <ul className="mt-5">
            {messages
              .filter(msg => msg.from === currentUser.id || msg.to === currentUser.id)
              .map(msg => (
                <li key={msg.id} className="mb-1">
                  {msg.from === currentUser.id ? 'You' : `User ${msg.from}`} to {msg.to === currentUser.id ? 'You' : `User ${msg.to}`}: {msg.text}
                </li>
              ))}
      </ul>)}
    </div>
  );
};

export default Home;
