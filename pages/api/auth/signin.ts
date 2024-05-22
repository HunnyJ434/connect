'use client'
import { ObjectId } from 'mongodb';
import { dbConnect } from '../../../lib/dbConnect';  // Adjust the import path as necessary
import bcrypt from 'bcryptjs';

export default async function handler(req: { method: string; body: { email: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; user?: { id: ObjectId; email: any; }; }): void; new(): any; }; }; }) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, password } = req.body;
    try {
        const db = await dbConnect();
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Authentication successful
        res.status(200).json({ message: 'Login successful', user: { id: user._id, email: user.email } });
    } catch (error) {
        console.error('Sign In Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
