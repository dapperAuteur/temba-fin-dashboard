import { Schema, model, models, Types } from 'mongoose';

const TransactionSchema = new Schema({
  accountId: { type: Types.ObjectId, required: true },
  value: { type: Number, required: true },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  vendor: { type: String },
  tags: { type: [String] },
});

export default models.Transaction || model('Transaction', TransactionSchema);