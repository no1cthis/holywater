// filepath: /Users/mykyta/projects/holywater/src/api/routes/screen.routes.ts
import { Router } from "express";

import { getActiveScreenConfiguration, setActiveScreenConfiguration } from "../mongodb/controllers/screen-configuration.controller";
import { handleRequest, sendError, sendNotFound, sendSuccess } from "../utils/api-response";

export const screenRoutes = Router();

// Get the active screen configuration (complete with sections and movies)
screenRoutes.get("/", async (_req, res) => {
  return handleRequest(res, async () => {
    const screenConfig = await getActiveScreenConfiguration();
    
    if (!screenConfig) {
      return sendError(
        res, 
        "No active screen configuration found. Please set one using /api/screen/set", 
        404
      );
    }
    
    return sendSuccess(res, screenConfig);
  });
});

// Set a screen configuration as active
screenRoutes.post("/set", async (req, res) => {
  return handleRequest(res, async () => {
    const { id } = req.body;
    
    if (!id) {
      return sendError(res, "Configuration ID is required in request body", 400);
    }
    
    const configuration = await setActiveScreenConfiguration(id);
    
    if (!configuration) {
      return sendNotFound(res, "Screen configuration");
    }
    
    return sendSuccess(
      res, 
      { id: configuration.id, name: configuration.name }
    );
  });
});