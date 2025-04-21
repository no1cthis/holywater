import mongoose from "mongoose";

import { mongoDbEmulatorUrl } from "./emulator/mongodb-emulator";

let isConnected = false;

export const connectToMongoDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI || mongoDbEmulatorUrl;
    
    await mongoose.connect(mongoURI);

    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}; 