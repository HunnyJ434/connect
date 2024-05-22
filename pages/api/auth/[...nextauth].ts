import { MongoClient } from 'mongodb';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../lib/dbConnect';
import { verifyPassword } from '../../../lib/auth';
import { User } from '../../../types'; // Make sure to import your User type

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your-email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        const db = await dbConnect();
        const users = db.collection('users');

        const user = await users.findOne({ email: credentials.email });

        if (!user || !await verifyPassword(credentials.password, user.password)) {
          return null;
        }

        // Ensure all required User fields are included
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || '' // Include other necessary fields
        } as User;
      }
    })
  ],
  // other NextAuth configuration...
});
