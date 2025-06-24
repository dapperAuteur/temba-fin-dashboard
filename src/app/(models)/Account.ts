/**
 * Represents an account in the application.
 * @interface IAccount
 * @property {string} _id - The unique identifier for the account.
 * @property {string} name - The name of the account.
 * @property {string} type - The type of the account.
 * @property {number} balance - The current balance of the account.
 * @property {Types.ObjectId} userId - The unique identifier of the user associated with the account.
 * @property {Types.ObjectId[]} tags - The unique identifiers of the tags associated with the account.
 */
import { Schema, model, models } from 'mongoose';
import { IAccount } from './../../../types/accounts';

const AccountSchema = new Schema<IAccount>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  balance: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }, // Reference to the User model
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }], // Optional: If you have a Tag model
});
export default models.Account || model<IAccount>('Account', AccountSchema);