import { Document, Types } from 'mongoose';

export enum AccountType {
  Checking = 'Checking',
  Savings = 'Savings',
  Credit = 'Credit',
  Investment = 'Investment'
}

export interface IAccount extends Document {
  _id?: string;
  name: string;
  type: AccountType;
  balance: number;
  userId: Types.ObjectId;
  tags?: Types.ObjectId[];
}
