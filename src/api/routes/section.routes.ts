import { type RequestHandler, Router } from "express";

import { SectionEnum } from "../../common/types";
import {
  createSection,
  deleteSection,
  getSectionById,
  getSections,
  updateSection,
} from "../mongodb/controllers/section.controller";
import { getFilterOptions } from "../utils/filtering";
import { registerRoutes } from "../utils/route-handler";
import { getSortOptions } from "../utils/sorting";

export const sectionRoutes = Router();

// Array of section types that should save movie items
const SECTIONS_WITH_MOVIES = [SectionEnum.HeroSlider];

// Middleware to validate section data based on type
const validateSectionData: RequestHandler = (req, _res, next) => {
  const { items, type } = req.body;
  
  // If type is not provided but updating with items, we'll handle in the controller
  if (!type) {
    next(); return;
  }
  
  // If section type shouldn't have items but they're provided, remove them
  if (!SECTIONS_WITH_MOVIES.includes(type) && items) {
    req.body.items = [];
  }
  
  next();
};

// Apply validation middleware to POST, PUT, and PATCH routes
sectionRoutes.use(['/', '/:id'], (req, res, next) => {
  if (['PATCH', 'POST', 'PUT'].includes(req.method)) {
    validateSectionData(req, res, next); return;
  }
  next();
});

// Register standard REST routes with our utility
registerRoutes({
  controllers: {
    create: createSection,
    delete: deleteSection,
    getById: getSectionById,
    getMany: getSections,
    update: updateSection
  },
  queryProcessors: {
    getFilterOptions,
    getSortOptions
  },
  resourceName: "Section",
  router: sectionRoutes
});