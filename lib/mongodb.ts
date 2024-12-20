import mongoose from "mongoose";
declare global {
  const mongoose: unknown;
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null
  };
}

async function dbConnect() {
  console.log("dbConnect");
  
  if (cached.conn) {
    console.log("cached");
    return cached.conn;
  }
  if (!cached.promise) {
    console.log("!cached.promise");
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("mongoose connected");
        
        return mongoose;
      });
  }
  try {
    console.log("cached.conn");
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.log('38 ./lib/dbConnect.ts e :>> ', e);
    throw e;
  }
  return cached.conn;
}

export default dbConnect;