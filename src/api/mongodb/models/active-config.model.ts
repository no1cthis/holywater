// filepath: /Users/mykyta/projects/holywater/src/api/mongodb/models/active-config.model.ts
import mongoose from "mongoose";

// A simple schema to store the active screen configuration reference
const ActiveConfigSchema = new mongoose.Schema({
  screenConfigId: {
    ref: "ScreenConfiguration",
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  updatedAt: {
    default: Date.now,
    type: Date
  }
}, {
  collection: "activeConfig"
});

// There should only ever be one document in this collection
export const ActiveConfig = mongoose.model("ActiveConfig", ActiveConfigSchema);