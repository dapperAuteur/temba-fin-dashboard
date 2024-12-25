import type { NextAuthOptions, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/(models)/User";
import bcrypt from "bcrypt";

interface CustomUser extends User {
  _id: string
  role: string
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
      async authorize(credentials): Promise<CustomUser | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const userRole = "Credential User"
          const foundUser = await User.findOne({ email: credentials.email })
            .lean()
            .exec()

          if (foundUser) {
            const match = await bcrypt.compare(credentials.password, foundUser.password)
            if (match) {
              const { password, ...userWithoutPassword } = foundUser
              return {
                ...userWithoutPassword,
                role: userRole,
                id: foundUser._id.toString(),
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
        // token._id = user._id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        console.log('78 Server session :>> ', session);
        console.log('79 Server token :>> ', token);
        // (session.user as any)._id = token._id
        (session.user as any).role = token.role
      }
      return session
    }
  }
}