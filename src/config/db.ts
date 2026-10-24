import mongoose from 'mongoose';

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined in environment variables');

  return await mongoose.connect(uri, {
    family: 4, // Force IPv4 (bypasses Vercel IPv6 routing timeouts)
    serverSelectionTimeoutMS: 5000, // Stop hanging indefinitely on failure
    bufferCommands: false, // Prevents queries from queueing indefinitely if connection drops
  });
};