import cors from "cors";
import express from "express";

import { connectToMongoDB } from "./api/mongodb/connect-to-mongodb";
import { movieRoutes } from "./api/routes/movie.routes";
import { screenConfigurationRoutes } from "./api/routes/screen-configuration.routes";
import { screenRoutes } from "./api/routes/screen.routes";
import { sectionRoutes } from "./api/routes/section.routes";
import storageRoutes from "./api/routes/storage.routes";
import { s3Emulator } from "./api/s3-bucket/emulator/s3-emulator";
import { initializeS3Bucket } from "./api/s3-bucket/s3-client";

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
await connectToMongoDB();

// Start the S3 emulator
await s3Emulator.run();

// Initialize S3 bucket
await initializeS3Bucket();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use("/api/movies", movieRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/screen-configurations", screenConfigurationRoutes);
app.use("/api/screen", screenRoutes);
app.use("/api/s3", storageRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});