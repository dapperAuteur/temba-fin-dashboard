import { Types } from "mongoose";

export interface IUser {
  _id: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: IUser;
  expires: string;
}

export interface OwnedResource {
  userId: Types.ObjectId;
  _id: Types.ObjectId;
}
