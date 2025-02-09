import type { NextAuthOptions, User as UserType } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/(models)/User";
import bcrypt from "bcrypt";

// Define what our database user looks like
interface DBUser {
  _id: string;
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define what our custom user looks like after authentication
interface CustomUser extends UserType {
  _id: string
  role: string
}

interface Credentials {
  email: string;
  password: string;
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

          const userRole = "Credential User"
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
              const { ...userWithoutPassword } = foundUser

              return {
                ...userWithoutPassword,
                role: userRole,
                _id: foundUser?._id.toString(),
              } as CustomUser
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
      if (user) {
        token._id = user._id.toString();
        token.role = user.role;
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as CustomUser)._id = token._id as string;
        (session.user as CustomUser).role = token.role as string;
      }
      return session
    }
  }
}