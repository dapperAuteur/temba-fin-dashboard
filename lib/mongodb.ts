import { MongoClient } from 'mongodb';

declare global {
  const _mongoClientPromise: Promise<MongoClient>;
}

const uri = process.env.MONGODB_URI || "";
const options = {};

let client: MongoClient;
// const clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

const clientPromise = global._mongoClientPromise;

export default clientPromise;