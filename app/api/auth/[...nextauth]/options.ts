import type { NextAuthOptions } from "next-auth"
// import { DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/(models)/User";
import bcrypt from "bcrypt";
// import { JWT } from "next-auth/jwt";
import { CustomJWT, CustomUser, Credentials } from "@/types/auth";

// Define what our database user looks like
interface DBUser {
  _id: string;
  email: string;
  password: string;
  name?: string;
  userRole?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "your-email",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "your-password",
        }
      },
      async authorize(credentials: Credentials | undefined): Promise<CustomUser | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const userRole = "User"
          const foundUser = await User.findOne({ email: credentials.email })
            .lean()
            .exec() as DBUser | null;

          if (foundUser) {
            if (!foundUser?.password) {
              console.log('User found but no password');
              return null;
          }
            const match = await bcrypt.compare(credentials.password, foundUser?.password)
            if (match) {
              const customUser: CustomUser = {
                ...foundUser,
                id: foundUser?._id.toString(),
                _id: foundUser?._id.toString(),
                email: foundUser?.email,
                name: foundUser?.name,
                userRole: foundUser?.userRole || userRole,
              }

              return customUser;
            }
          }
        } catch (err) {
          console.error('Authentication error:', err)
        }
        return null
      }
    })
  ],
  pages: {
    // signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/signup",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'userRole' in user && '_id' in user) {
        const customUserJWT = user as CustomUser;
        return {
          ...token,
          _id: customUserJWT._id,
          userRole: customUserJWT.userRole,
        }
      }
      return token as CustomJWT;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as CustomUser).id = token.id as string;
        (session.user as CustomUser)._id = token._id as string;
        (session.user as CustomUser).userRole = token.userRole as string;
      }
      return session
    }
  }
}