import { Schema, model, models } from 'mongoose';

const TagSchema = new Schema({
  name: { type: String, required: true, unique: true }, // Tag name must be unique
  description: { type: String }, // Optional description for the tag
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the tag was created
});

export default models.Tag || model('Tag', TagSchema);
