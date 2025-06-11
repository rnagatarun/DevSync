import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const dbURI = `mongodb+srv://${process.env.VITE_MONGO_USERNAME}:${process.env.VITE_MONGO_PASSWORD}@devsync.kjowknq.mongodb.net/devSyncData?retryWrites=true&w=majority`;
    await mongoose.connect(dbURI, {});
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;