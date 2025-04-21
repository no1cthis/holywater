import type { Request } from 'express';

export interface SortOption {
  field: string;
  order: SortOrder;
}

// Define types for sort parameters
export type SortOrder = "asc" | "desc";

/**
 * Process sort query parameters and convert them into a sort options array
 * @param query - Express query object containing _sort and _order parameters
 * @returns Array of sort options with default sort by createdAt if no valid sort parameters
 */
export const getSortOptions = (
  query: Request["query"]
): SortOption[] => {
  const { _order, _sort } = query;

  if (!_sort || !_order) {
    // Default sort by createdAt in descending order when no sort is specified
    return [{ field: "createdAt", order: "desc" }];
  }

  // Handle both string and array inputs
  const fields = Array.isArray(_sort) ? _sort : [_sort as string];
  const orders = Array.isArray(_order) ? _order : [_order as string];

  // Create sort options array
  const sortOptions = fields.map((field, index) => ({
    field: field as string,
    order: (orders[index] || "asc") as SortOrder
  }));

  return sortOptions.length > 0 ? sortOptions : [{ field: "createdAt", order: "desc" }];
}