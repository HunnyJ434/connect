import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "../../../lib/dbConnect"; // Adjust the path if necessary

const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Invalid credentials provided");
        }

        // Connect to the database
        const db = await dbConnect();
        const usersCollection = db.collection("users");

        // Find the user by email
        const user = await usersCollection.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("User not found");
        }

        // Validate the password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Return user object (include fields you need)
        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username || "User",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for session management
    maxAge: 24 * 60 * 60, // Session lasts 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          username: token.username,
        };
      }
      return session;
    },
  },
  secret: "60611c280e79ae8b7aa2ee878b4a09ed816238c9774a5934ca9d750faea82e5b", // Replace with a secure, random string
  pages: {
    signIn: "/signin", // Redirect to your custom sign-in page
    signOut: "/signup", // Redirect to your custom sign-out page
  },
};

export default NextAuth(authOptions);
