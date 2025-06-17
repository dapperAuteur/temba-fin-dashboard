// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import clientPromise from "@/lib/db/mongodb";
// import { ObjectId } from "mongodb";
import { NextAuthOptions } from "next-auth";
import { LogContext, Logger } from "@/lib/logging/logger";

// Extract the configuration options to be reused
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        const { email, password } = credentials;
        
        try {
          const client = await clientPromise;
          const db = client.db();
          const user = await db.collection("users").findOne({ email });
          
          if (!user) {
            Logger.error(LogContext.USER,"User not found:", email);
            return null;
          }
          
          const isPasswordValid = await compare(password, user.password);
          
          if (!isPasswordValid) {
            Logger.error(LogContext.USER,"Invalid password for user:", email);
            return null;
          }
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {

          Logger.error(LogContext.USER,"Error during authorization:", {
            email,
            error
          });
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Create a handler using the auth options
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };