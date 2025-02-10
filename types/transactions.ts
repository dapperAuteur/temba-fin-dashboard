import { Types } from 'mongoose';

export enum TransactionType {
  Deposit = 'Deposit',
  Withdrawal = 'Withdrawal',
  Transfer = 'Transfer',
  Payment = 'Payment'
}

export interface ITransaction {
  _id?: string;
  accountId: Types.ObjectId;
  value: number;
  type: TransactionType;
  date: Date;
  vendor?: string;
  tags?: string[];
  userId: string;
}
