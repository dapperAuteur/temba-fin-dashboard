import { Schema, model, models, Types, Document } from 'mongoose';

export interface IAccount extends Document {
  name: string;
  type: string;
  balance: number;
  userId: Types.ObjectId;
  tags: Types.ObjectId[];
}

const AccountSchema = new Schema<IAccount>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  balance: { type: Number, required: true },
  userId: { type: Types.ObjectId, required: true, ref: "User" }, // Reference to the User model
  tags: [{ type: Types.ObjectId, ref: "Tag" }], // Optional: If you have a Tag model
});
export default models.Account || model<IAccount>('Account', AccountSchema);