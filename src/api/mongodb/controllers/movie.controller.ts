import type { Movie as MovieType } from "../../../common/types";
import { createCrudService } from "../crud-service";
import { Movie } from "../models/movie.model";

// Create a CRUD service for the Movie model using the functional approach
const movieService = createCrudService<MovieType>({
  entityName: 'Movie',
  model: Movie
});

// Export all CRUD operations
export const {
  create: createMovie,
  delete: deleteMovie,
  getById: getMovieById,
  getMany: getMovies,
  update: updateMovie
} = movieService;