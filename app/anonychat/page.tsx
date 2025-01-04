'use client';

import { useState, useEffect } from 'react';
import useUsers, { User } from '../../hooks/useUsers';

interface Message {
  id: number;
  text: string;
  from: string;
  to: string;
  timestamp: Date;
}

const Anonychat = () => {
  const { users, setUsers, currentUser, setCurrentUser, socket } = useUsers();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [recipientId, setRecipientId] = useState<string | null>(null); // Ensure recipientId is a string
  const [showMessageWindow, setShowMessageWindow] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on('newDirectMessage', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('loadMessages', (loadedMessages: Message[]) => {
        setMessages(loadedMessages);
      });

      socket.on('userList', (data: User[]) => {
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
  }, [socket, setUsers]);

  const sendMessage = () => {
    if (currentUser && recipientId && messageText && socket) {
      const newMessage: Message = {
        id: Date.now(), // Unique message id based on timestamp
        text: messageText,
        from: currentUser.id,
        to: recipientId,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Add sent message locally
      socket.emit('directMessage', newMessage); // Send message to server
      setMessageText(''); // Clear input field after sending
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      sendMessage(); // Send the message
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-3">User List</h1>
      <ul className="list-disc pl-5">
        {users.map((user) => (
          <li key={user.userId} className="mb-1">
            User ID: {user.userId} {user.userId === currentUser?.id && '(You)'}
            {user.userId !== currentUser?.id && (
              <button
                onClick={() => {
                  setRecipientId(user.userId);
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

      <div className="mt-5">
        <h2 className="text-lg font-bold mb-3">Messages</h2>
        <ul className="mt-5">
          {messages
            .filter((msg) => msg.from === currentUser?.id || msg.to === currentUser?.id)
            .map((msg, index) => (
              <li key={index} className="mb-1">
                {msg.from === currentUser?.id ? 'You' : `User ${msg.from}`} to{' '}
                {msg.to === currentUser?.id ? 'You' : `User ${msg.to}`}: {msg.text}
              </li>
            ))}
        </ul>
      </div>

      {currentUser && recipientId && showMessageWindow && (
        <div className="mt-5">
          <h2 className="text-lg font-bold mb-3">Send a Message to User {recipientId}</h2>
          <textarea
            placeholder="Message"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown} // Add the keydown event handler
            className="mb-2 p-2 border w-full h-24"
            style={{ color: 'black' }} // Ensure text is visible by setting the color
          />
          <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded">
            Send Message
          </button>
        </div>
      )}
    </div>
  );
};

export default Anonychat;
