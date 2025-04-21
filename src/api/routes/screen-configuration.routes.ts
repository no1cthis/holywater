import { Router } from "express";

import { createScreenConfiguration, deleteScreenConfiguration, getScreenConfigurationById, getScreenConfigurations, setActiveScreenConfiguration, updateScreenConfiguration } from "../mongodb/controllers/screen-configuration.controller";
import { handleRequest, sendError, sendNotFound, sendSuccess } from "../utils/api-response";
import { getFilterOptions } from "../utils/filtering";
import { registerRoutes } from "../utils/route-handler";
import { getSortOptions } from "../utils/sorting";

export const screenConfigurationRoutes = Router();

// Register standard CRUD routes with our utility
registerRoutes({
  controllers: {
    create: createScreenConfiguration,
    delete: deleteScreenConfiguration,
    getById: getScreenConfigurationById,
    getMany: getScreenConfigurations,
    update: updateScreenConfiguration
  },
  queryProcessors: {
    getFilterOptions,
    getSortOptions
  },
  resourceName: "ScreenConfiguration",
  router: screenConfigurationRoutes
});

// Add custom route to set a screen configuration as active
screenConfigurationRoutes.post("/set-active", async (req, res) => {
  return handleRequest(res, async () => {
    const id = req.body.id;
    
    if (!id) {
      return sendError(res, "Configuration ID is required in request body", 400);
    }
    
    const configuration = await setActiveScreenConfiguration(id);
    
    if (!configuration) {
      return sendNotFound(res, "ScreenConfiguration");
    }
    
    return sendSuccess(res, configuration);
  });
});