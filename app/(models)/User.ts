"use server"
import mongoose, { Schema, model, models } from "mongoose";
import dbConnect from "./../../lib/dbConnect";

// Define the User schema
const UserSchema = new Schema(
  {
    _id: { 
      type: mongoose.Schema.Types.ObjectId,
      auto: true, // Auto-generate ObjectId if not provided
      default: () => new mongoose.Types.ObjectId()
    },
    name: { type: String },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { 
      type: String, 
      required: [true, "Password is required"]
    },
    userRole: { 
      type: String, 
      default: "User",
      enum: ["User", "Admin"]
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// This is important - connect to DB before accessing the model
// This follows the singleton pattern recommended for Next.js
const User = models.User || model("User", UserSchema);

// Export the User model
export default User;

// This function ensures we're connected to the database before using the model
export async function getUserModel() {
  await dbConnect();
  return User;
}