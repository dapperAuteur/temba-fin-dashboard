"use server"
import mongoose, { Schema, model, models } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const UserSchema = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = models?.User || model("User", UserSchema);

export default User;
