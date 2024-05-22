// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '../../../lib/auth';
import dbConnect from '../../../lib/dbConnect';  // Import your dbConnect utility

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        const hashedPassword = await hashPassword(password);

        try {
            const db = await dbConnect();
            const collection = db.collection('users');

            // Check if email already exists
            const existingUser = await collection.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: 'Email already exists' });
            }

            // Insert the new user
            const result = await collection.insertOne({
                email,
                password: hashedPassword
            });

            res.status(201).json({ message: 'User created!', userId: result.insertedId });
        } catch (error) {
            res.status(500).json({ message: 'Could not register user' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
