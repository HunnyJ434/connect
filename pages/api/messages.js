// Temporary in-memory store
let messages = [];

export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json(messages);
    } else if (req.method === 'POST') {
        const { text, from, to } = req.body;
        const message = {
            id: messages.length + 1,
            text,
            from,
            to,
            timestamp: new Date(),
        };
        messages.push(message);
        res.status(201).json(message);
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
