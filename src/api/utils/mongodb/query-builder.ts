import mongoose from 'mongoose';

import { applyFilters, type Filter } from '../filtering';
import type { SortOption } from '../sorting';

/**
 * Options for building a MongoDB query
 */
export interface QueryBuilderOptions {
  additionalCriteria?: Record<string, any>;
  filters?: Filter[];
  ids?: string[];
  sort?: SortOption[];
}

/**
 * Builds a MongoDB query based on provided options
 */
export const buildMongoQuery = (options: QueryBuilderOptions): {
  query: Record<string, unknown>;
  sortOptions: Record<string, -1 | 1>;
} => {
  let query: Record<string, unknown> = {};
  
  // Add ID filtering if provided
  if (options.ids && options.ids.length > 0) {
    query._id = { 
      $in: options.ids.map(id => 
        mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id
      ) 
    };
  }
  
  // Apply filters if provided
  if (options.filters && options.filters.length > 0) {
    query = { ...query, ...applyFilters(options.filters) };
  }
  
  // Add any additional criteria if provided
  if (options.additionalCriteria) {
    query = { ...query, ...options.additionalCriteria };
  }
  
  // Build sort options or use default (createdAt desc)
  const sortOptions = options.sort?.reduce((acc, curr) => {
    acc[curr.field] = curr.order === "asc" ? 1 : -1;
    return acc;
  }, {} as Record<string, -1 | 1>) || { createdAt: -1 };
  
  return { query, sortOptions };
};