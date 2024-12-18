import { MongoClient } from 'mongodb';

const mongoURI = process.env.MONGODB_URI;
const client = new MongoClient(mongoURI); 

let clientPromise;

if (!global._mongoClientPromise) {
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;

