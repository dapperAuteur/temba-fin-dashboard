import { Schema, model, models, Types } from 'mongoose';

const AccountSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  balance: { type: Number, required: true },
  userId: { type: Types.ObjectId, required: true },
});

export default models.Account || model('Account', AccountSchema);