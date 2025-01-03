'use client';

import { useState, useEffect } from 'react';
import useUsers, { User } from '../../hooks/useUsers';

interface Message {
  id: number;
  text: string;
  from: number;
  to: number;
  timestamp: Date;
}

const Anonychat = () => {
  const { users, setUsers, currentUser, setCurrentUser, socket } = useUsers();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [recipientId, setRecipientId] = useState<number | null>(null);
  const [showMessageWindow, setShowMessageWindow] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on('newDirectMessage', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        console.log('New direct message received:', message);
        if (message.to === currentUser?.id) {
          setRecipientId(message.from);
          setShowMessageWindow(true);
        }
      });

      socket.on('loadMessages', (loadedMessages: Message[]) => {
        setMessages(loadedMessages);
        console.log('Loaded messages:', loadedMessages);
      });

      socket.on('userList', (data: User[]) => {
        console.log('Received user list:', data);
        setUsers(data);
      });
    }

    return () => {
      if (socket) {
        socket.off('newDirectMessage');
        socket.off('loadMessages');
        socket.off('userList');
      }
    };
  }, [socket, currentUser, setUsers]);

  const sendMessage = () => {
    if (currentUser && recipientId && messageText && socket) {
      console.log('Sending direct message:', { text: messageText, from: currentUser.id, to: recipientId });
      socket.emit('directMessage', {
        text: messageText,
        from: currentUser.id,
        to: recipientId,
      });
      setMessageText(''); // Clear input after sending
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Check if the Enter key was pressed (without Shift)
      e.preventDefault(); // Prevent the default behavior (creating a new line)
      sendMessage(); // Send the message
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-3">User List</h1>
      <ul className="list-disc pl-5">
        {users.map((user) => (
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
            onKeyDown={handleKeyDown} // Add the keydown event handler
            className="mb-2 p-2 border w-full h-24"
            style={{ color: 'black' }}
          />
          <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded">
            Send Message
          </button>
          <ul className="mt-5">
            {messages
              .filter((msg) => msg.from === currentUser.id || msg.to === currentUser.id)
              .map((msg) => (
                <li key={msg.id} className="mb-1">
                  {msg.from === currentUser.id ? 'You' : `User ${msg.from}`} to {msg.to === currentUser.id ? 'You' : `User ${msg.to}`}: {msg.text}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Anonychat;
