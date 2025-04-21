import { Router } from "express";

import { createMovie, deleteMovie, getMovieById, getMovies, updateMovie } from "../mongodb/controllers/movie.controller";
import { getFilterOptions } from "../utils/filtering";
import { registerRoutes } from "../utils/route-handler";
import { getSortOptions } from "../utils/sorting";

export const movieRoutes = Router();

// Register standard REST routes with our utility
registerRoutes({
  controllers: {
    create: createMovie,
    delete: deleteMovie,
    getById: getMovieById,
    getMany: getMovies,
    update: updateMovie
  },
  queryProcessors: {
    getFilterOptions,
    getSortOptions
  },
  resourceName: "Movie",
  router: movieRoutes
});