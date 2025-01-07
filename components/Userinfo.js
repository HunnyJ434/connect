'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const { data: session } = useSession();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);

    useEffect(() => {
        if (session) {
            fetch('/api/users')
                .then((response) => response.json())
                .then((data) => {
                    const filteredUsers = data.filter((user) => user.email !== session.user.email);
                    setUsers(filteredUsers);
                })
                .catch((error) => console.error('Error fetching users:', error));
        }
    }, [session]);

    // Fetch messages for the selected user
    useEffect(() => {
        if (selectedUser) {
            setLoadingMessages(true);
            fetch(`/api/messages?sender=${session.user.email}&recipient=${selectedUser.email}`)
                .then((response) => response.json())
                .then((data) => {
                    setMessages(data.data || []);
                    setLoadingMessages(false);
                })
                .catch((error) => {
                    console.error('Error fetching messages:', error);
                    setLoadingMessages(false);
                });
        }
    }, [selectedUser, session]);

    // Send a new message
    const sendMessage = async () => {
        if (newMessage.trim() === '' || !selectedUser) return;

        const messageData = {
            sender: session.user.email,
            recipient: selectedUser.email,
            message: newMessage,
            timestamp: new Date().toISOString(),
            read: false,
        };

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData),
            });

            if (response.ok) {
                // Update the local messages list
                setMessages((prev) => [...prev, messageData]);
                setNewMessage(''); // Clear the message input field after sending
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-center text-gray-700">You are not logged in. Please sign in.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <h1 className="text-2xl font-bold text-gray-700 mb-4">
                Welcome, {session.user.username || 'User'}!
            </h1>

            <div className="flex w-full max-w-4xl">
                {/* User List */}
                <div className="w-1/3 bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-bold text-gray-700">Users:</h2>
                    <ul className="mt-4 space-y-2 overflow-y-auto max-h-96">
                        {users.map((user) => (
                            <li
                                key={user._id}
                                className={`p-4 rounded-lg shadow cursor-pointer ${selectedUser?.email === user.email ? 'bg-gray-200' : 'bg-white'}`}
                                onClick={() => setSelectedUser(user)}
                            >
                                <p className="text-gray-800 font-semibold">{user.username || 'No Name'}</p>
                                <p className="text-gray-600">{user.email}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Chat Section */}
                <div className="w-2/3 bg-white text-black font-black font-normal p-4 rounded-lg shadow ml-4 flex flex-col">
                    {selectedUser ? (
                        <>
                            <h2 className="text-lg font-bold text-gray-700 mb-4">
                                Chat with {selectedUser.username || selectedUser.email}
                            </h2>
                            <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4">
                                {loadingMessages ? (
                                    <p>Loading messages...</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {messages.map((msg, idx) => (
                                            <li
                                                key={idx}
                                                className={`p-2 rounded-lg ${msg.sender === session.user.email ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'}`}
                                            >
                                                <p className="text-sm text-gray-700">{msg.message}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(msg.timestamp).toLocaleString()}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {/* Message Input */}
                            <div className="flex">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyDown} // Add event listener here
                                    placeholder="Type a message..."
                                    className="flex-1 border rounded-lg p-2 mr-2"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-600">Select a user to start chatting.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
