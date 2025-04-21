// filepath: /Users/mykyta/projects/holywater/src/api/utils/filtering.ts
import type { Request } from 'express';

/**
 * Filter structure used by controllers
 */
export interface Filter {
  field: string;
  operator: FilterOperator;
  value: string | string[];
}

/**
 * Defines the operators supported by the filtering utility
 */
export type FilterOperator = 'contains' | 'eq' | 'in';

/**
 * Extracts filter parameters from query parameters using Refine's naming convention:
 * - field_like - For contains/regex filters
 * - field_in - For array inclusion filters
 * - field (exact value) - For exact match filters
 * 
 * @param query - Express request query object
 * @param fieldMappings - Optional mappings to remap query parameter names to different field names
 * @returns Array of filter objects for use with MongoDB queries
 */
export const getFilterOptions = (
  query: Request['query'],
  fieldMappings: Record<string, string> = {}
): Filter[] => {
  const filters: Filter[] = [];
  
  // Process all query parameters
  Object.entries(query).forEach(([key, value]) => {
    // Skip null/undefined values and sort/pagination parameters
    if (!value || key.startsWith('_')) return;

    // Process "like" filters (contains/regex search)
    if (key.endsWith('_like')) {
      const field = fieldMappings[key.slice(0, -5)] || key.slice(0, -5);
      filters.push({
        field,
        operator: 'contains',
        value: value as string
      });
    }
    // Process "in" filters (array inclusion)
    else if (key.endsWith('_in')) {
      const field = fieldMappings[key.slice(0, -3)] || key.slice(0, -3);
      const values = (Array.isArray(value) ? value : [value]) as string[];
      filters.push({
        field,
        operator: 'in',
        value: values.filter(Boolean)
      });
    }
    // Skip id parameters as they're handled separately
    else if (key !== 'id') {
      // Assume exact match for other parameters
      const field = fieldMappings[key] || key;
      filters.push({
        field,
        operator: 'eq',
        value: value as string
      });
    }
  });

  console.log('Filters:', filters);
  
  return filters;
};

/**
 * Applies filter conditions to a MongoDB query object
 * 
 * @param filters - Array of filter objects
 * @returns MongoDB query conditions to apply
 */
export const applyFilters = (filters: Filter[]): Record<string, unknown> => {
  const query: Record<string, unknown> = {};
  
  if (!filters || filters.length === 0) {
    return query;
  }
  
  filters.forEach((filter) => {
    if (filter.operator === 'eq') {
      query[filter.field] = filter.value;
    } 
    else if (filter.operator === 'contains' && typeof filter.value === 'string') {
      query[filter.field] = { $options: 'i', $regex: filter.value };
    } 
    else if (filter.operator === 'in' && Array.isArray(filter.value)) {
      query[filter.field] = { $in: filter.value };
    }
  });
  
  return query;
};