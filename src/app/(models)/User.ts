"use server"
import mongoose, { Schema, model, models } from "mongoose";

// First, check if we have a connection string
if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Now TypeScript knows MONGODB_URI is definitely a string
const uri: string = process.env.MONGODB_URI;

try {
  mongoose.connect(uri);
  mongoose.Promise = global.Promise;
} catch (error) {
  console.error('Error connecting to MongoDB:', error);
  throw error;
}



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
    userRole: { type: String, default: "User" },
  },
  {
    timestamps: true,
  }
);

const User = models?.User || model("User", UserSchema);

export default User;
