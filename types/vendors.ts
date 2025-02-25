import { Document, Types } from 'mongoose';

export interface IVendor extends Document {
  _id: string;
  name: string;
  websites?: string[];
  contacts?: string[];
  tags?: Types.ObjectId[];
}