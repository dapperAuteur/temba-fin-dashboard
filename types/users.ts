export interface DBUser {
  _id: string;
  email: string;
  password: string;
  name?: string;
  userRole?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  _id: string;
  email: string;
  image?: string;
  name?: string | null;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}