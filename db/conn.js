import { MongoClient } from 'mongodb';

const connectionString = process.env.ATLAS_URI;
export const client = new MongoClient(connectionString);
let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}

let db = conn.db(process.env.DB_NAME || 'sample_training');

export default db;
