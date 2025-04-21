import mongoose from "mongoose";

import type { Movie as MovieType } from "../../../common/types";
import { movieJsonSchema } from "../../../schemas/movie.schema";
import { jsonSchemaToMongooseSchema } from "../../../schemas/schema-converter";

// Convert the JSON Schema to a Mongoose schema
const MovieSchema = jsonSchemaToMongooseSchema(movieJsonSchema);

export const Movie = mongoose.models.Movie || mongoose.model<MovieType>("Movie", MovieSchema);