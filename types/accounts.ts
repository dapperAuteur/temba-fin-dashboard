import { Types } from 'mongoose';

export enum AccountType {
  Checking = 'Checking',
  Savings = 'Savings',
  Credit = 'Credit',
  Investment = 'Investment'
}

export interface IAccount {
  _id?: string;
  name: string;
  type: AccountType;
  balance: number;
  userId: string;
  tags?: Types.ObjectId[];
}
