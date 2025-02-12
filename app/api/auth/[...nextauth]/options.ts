import type { NextAuthOptions, User as UserType } from "next-auth"
import { DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/(models)/User";
import bcrypt from "bcrypt";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface CustomUser extends DefaultUser {
    id: string;
    _id: string;
    email: string;
    name?: string | null;
    role: string;
  }
}

interface CustomJWT extends JWT {
  _id?: string;
  role?: string;
}

// Extend the session type to include our custom fields
// interface Session {
//   user: CustomUser & {
//     _id: string;
//     role: string;
//   }
// }

// Extend the JWT type to include our custom fields
// interface JWT {
//   _id?: string;
//   role?: string;
// }

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
  id: string
  _id: string
  email: string
  name?: string | null
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
              const customUser: CustomUser = {
                id: foundUser?._id.toString(),
                _id: foundUser?._id.toString(),
                email: foundUser?.email,
                name: foundUser?.name,
                role: userRole,
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
      if (user && 'role' in user && '_id' in user) {
        const customUserJWT = user as CustomUser;
        return {
          ...token,
          _id: customUserJWT._id,
          role: customUserJWT.role,
        }
      }
      return token as CustomJWT;
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