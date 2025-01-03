import { dbConnect } from '../../../lib/dbConnect';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Connect to the database
        const db = await dbConnect();
        const usersCollection = db.collection('users');

        // Fetch all users, excluding the currently logged-in user (use email or id to identify the user)
        const users = await usersCollection
            .find({}, { projection: { password: 0 } }) // Exclude the password field
            .toArray();

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
