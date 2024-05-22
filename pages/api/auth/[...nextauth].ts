import { User } from '../../../types';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../lib/dbConnect';
import { verifyPassword } from '../../../lib/auth';

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

            return {
              email: user.email,
              id: user._id.toString() // Ensure all required User fields are included
            } as User;
          }
        })
    ],
    // your other NextAuth configuration...
});
