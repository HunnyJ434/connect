import { dbConnect } from '../../lib/dbConnect';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Handle sending a new message
        const { sender, recipient, message, timestamp, read } = req.body;

        if (!sender || !recipient || !message) {
            return res.status(400).json({ success: false, error: 'Sender, recipient, and message are required' });
        }

        try {
            const db = await dbConnect();
            const messagesCollection = db.collection('messages');

            const newMessage = {
                sender,
                recipient,
                message,
                timestamp,
                read: read || false,
            };

            const result = await messagesCollection.insertOne(newMessage);

            res.status(201).json({ success: true, message: 'Message sent successfully', data: result });
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ success: false, error: 'Failed to send message' });
        }
    } else if (req.method === 'GET') {
        // Handle fetching messages
        const { sender, recipient } = req.query;

        try {
            const db = await dbConnect();
            const messagesCollection = db.collection('messages');

            const filter = {};
            if (sender) filter.sender = sender;
            if (recipient) filter.recipient = recipient;

            const messages = await messagesCollection.find(filter).toArray();

            res.status(200).json({ success: true, data: messages });
        } catch (error) {
            console.error("Error fetching messages:", error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    }
}
