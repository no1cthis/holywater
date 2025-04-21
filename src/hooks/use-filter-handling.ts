import type { CrudFilter, CrudFilters, LogicalFilter } from "@refinedev/core";

/**
 * Custom hook for handling filters in list pages
 * Extracts common filtering logic used across resource list components
 */
interface UseFilterHandlingProps {
  filters: CrudFilters;
  setFilters: (filters: CrudFilters, behavior?: "merge" | "replace") => void;
}

export const useFilterHandling = ({ filters, setFilters }: UseFilterHandlingProps) => {
  /**
   * Add or update a filter
   */
  const handleFilter = (filter: LogicalFilter) => {
    const existingFilters = filters.filter(
      (f) => "field" in f && f.field !== filter.field
    );
    setFilters([...existingFilters, filter]);
  };

  /**
   * Remove a filter by field name
   */
  const handleRemoveFilter = (field: string) => {
    const existingFilters = filters.filter(
      (f) => "field" in f && f.field !== field
    );
    
    setFilters(existingFilters, "replace");
  };

  /**
   * Get the value of a filter by field name
   */
  const getFilterValue = (field: string) => {
    const filter = filters.find((f: CrudFilter) => "field" in f && f.field === field);
    return filter?.value || [];
  };

  return {
    getFilterValue,
    handleFilter,
    handleRemoveFilter
  };
};