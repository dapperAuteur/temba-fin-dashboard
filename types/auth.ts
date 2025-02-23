import { Types } from "mongoose";
import { JWT } from "next-auth/jwt";
import { IUser } from "./users";

export interface Session {
  user: IUser;
  expires: string;
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
  _id?: string;
  userRole?: string;
}

