import mongoose, { type Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable.');
}

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Keep a single cache object on the Node.js global scope so hot reloads
// in development don't create a new connection on every file change.
const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = cached;
}

export default async function connectToDatabase(): Promise<Mongoose> {
  // Reuse the existing connection when it is already established.
  if (cached.conn) {
    return cached.conn;
  }

  // Reuse the in-flight connection promise so concurrent calls don't
  // open multiple connections at startup.
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise so the next attempt can retry cleanly.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
