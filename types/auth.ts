import { Types } from "mongoose";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
// import { IUser } from "./users";

// export interface Session extends DefaultSession {
//   user: IUser;
//   expires: string;
// }

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      _id: string
      email: string
      name?: string | null
      image?: string
      userRole?: string
      createdAt: Date
      updatedAt: Date
    } & DefaultSession["user"]
  }
}

export interface CustomUser {
  id: string
  _id: string
  email: string
  name?: string | null
  image?: string
  userRole?: string
  createdAt: Date
  updatedAt: Date
}


export interface OwnedResource {
  userId: Types.ObjectId;
  _id: Types.ObjectId;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface CustomJWT extends JWT {
  id?: string;
  _id?: string;
  userRole?: string;
}

