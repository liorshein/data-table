import React, { useEffect, useMemo, useState } from 'react';

import { FilterOption, FiltersDropdown, FiltersObj } from '@/components/shared/filters-dropdown';
import { Chip } from '@/components/ui/chip';
import { useQueryParams } from '@/hooks/useUrlParams';

type FiltersProps = {
  /** Array of filter options to populate the filters dropdown */
  filterOptions: FilterOption[];
  /** Callback function triggered when filters are applied or cleared
   * @param {FiltersObj} filters The current filter state, with undefined values for cleared filters
   */
  handleFiltersApply: (filters: FiltersObj) => void;
  /** Optional additional filter components to render alongside the main filter dropdown */
  additionalFilters?: React.ReactNode[];
};

/**
 * A component that provides filtering functionality for tables with features:
 * - Main filter dropdown with multiple options
 * - Additional custom filters support
 * - Active filter count indicator
 * - Clear all filters functionality
 * - Results count display
 */
const Filters = ({ filterOptions, handleFiltersApply, additionalFilters = [] }: FiltersProps) => {
  const [queryParams] = useQueryParams();
  const { filters } = queryParams;

  const activeFilters = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) return {};

    const availableFilterKeys = [...new Set(filterOptions.map((option) => option.key))];

    return Object.entries(filters).reduce((acc, [key, value]) => {
      if (availableFilterKeys.includes(key) && value !== undefined && value.length > 0) {
        const validValues = filterOptions
          .filter((option) => option.key === key)
          .map((option) => option.value);
        const validFilterValues = Array.isArray(value)
          ? value.filter((v) => validValues.includes(v))
          : value;

        if (validFilterValues.length > 0) {
          acc[key] = validFilterValues;
        }
      }
      return acc;
    }, {} as FiltersObj);
  }, [filters, filterOptions]);

  const [selectedFilters, setSelectedFilters] = useState<FiltersObj>(activeFilters);

  useEffect(() => {
    setSelectedFilters(activeFilters);
  }, [activeFilters]);

  const totalActiveFilters = useMemo(() => Object.keys(activeFilters).length, [activeFilters]);

  const handleClearGroup = (key: string) => {
    const updatedFilters = { ...selectedFilters };
    delete updatedFilters[key];
    setSelectedFilters(updatedFilters);

    const clearedFilter = {
      [key]: undefined,
    };

    handleFiltersApply(clearedFilter);
  };

  const handleClearAll = () => {
    const clearedFilters = Object.keys(selectedFilters).reduce(
      (acc, key) => ({
        ...acc,
        [key]: undefined,
      }),
      {},
    );

    setSelectedFilters({});
    handleFiltersApply(clearedFilters);
  };

  return (
    <div className="flex justify-center items-center gap-2">
      <div className="relative">
        <FiltersDropdown
          variant="secondary"
          options={filterOptions}
          value={selectedFilters}
          onChange={setSelectedFilters}
          onApply={() => {
            handleFiltersApply(selectedFilters);
          }}
          onClearGroup={handleClearGroup}
          onClearAll={handleClearAll}
        />
        {totalActiveFilters > 0 && (
          <Chip className="absolute -left-1 -top-1 h-[18px] w-[18px] text-xs">
            {totalActiveFilters}
          </Chip>
        )}
      </div>
      {additionalFilters.map((filter, index) => (
        <React.Fragment key={index}>{filter}</React.Fragment>
      ))}
    </div>
  );
};

export { Filters };
