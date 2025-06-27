import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Button,
  Chip,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  FilterOption,
} from '@/components';
import { CheckboxFilterGroup } from '@/components/shared/data-table/toolbar/filters/CheckboxFilterGroup';
import { useQueryParams } from '@/hooks/useUrlParams';
import { FilterIcon } from 'lucide-react';

export type FilterValue = string[] | string | undefined;
export type FiltersObj = Record<string, FilterValue>;

export type CustomFilterProps = {
  /** Array of currently selected values */
  selectedValues: string[];
  /** Callback when selection changes */
  onSelectionChange: (values: string[]) => void;
  /** Whether the filter dropdown is open */
  isOpen: boolean;
  /** Callback to clear all selections in this group */
  onClearGroup: () => void;
};

export type FilterGroup = {
  /** Unique identifier for the filter group */
  key: string;
  /** Display name for the filter group */
  name: string;
  /** Optional custom component to render for this filter group */
  component?: React.FC<CustomFilterProps>;
  /** Optional list of filter options for standard checkbox groups */
  options?: FilterOption[];
};

export type DropdownFiltersProps = {
  /** Array of filter groups to display in the dropdown */
  filterGroups: FilterGroup[];
};

/**
 * Renders a dropdown menu with various filter options that updates URL query parameters
 */
const DropdownFilters = ({ filterGroups }: DropdownFiltersProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const [queryParams, setQueryParams] = useQueryParams();
  const { filters } = queryParams;

  const handleSubMenuOpenChange = (groupName: string, open: boolean) => {
    setOpenSubMenu(open ? groupName : null);
  };

  /**
   * Extracts all available filter keys from the provided filter groups
   */
  const availableFilterKeys = useMemo(() => {
    return filterGroups.reduce((acc, group) => {
      if (group.component) {
        acc.push(group.key);
      } else if (group.options) {
        group.options.forEach((option) => {
          if (!acc.includes(option.key)) {
            acc.push(option.key);
          }
        });
      }
      return acc;
    }, [] as string[]);
  }, [filterGroups]);

  /**
   * Extracts active filters from URL query parameters
   */
  const activeFilters = useMemo(() => {
    if (!filters) return {};

    return Object.entries(filters).reduce((acc, [key, value]) => {
      if (availableFilterKeys.includes(key) && value !== undefined && value !== '') {
        const validValues = Array.isArray(value) ? value : [value];
        if (validValues.length > 0 && validValues[0] !== '') {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as FiltersObj);
  }, [filters, availableFilterKeys]);

  const [selectedFilters, setSelectedFilters] = useState<FiltersObj>(activeFilters || {});

  useEffect(() => {
    if (Object.keys(activeFilters).length > 0) {
      setSelectedFilters(activeFilters);
    }
  }, [activeFilters]);

  /**
   * Groups filter options by their keys for checkbox filters
   */
  const groupedOptions = useMemo(() => {
    const groups: Record<string, { name: string; options: FilterOption[] }> = {};

    filterGroups.forEach((group) => {
      if (group.options && group.options.length > 0) {
        groups[group.key] = {
          name: group.name,
          options: group.options,
        };
      }
    });

    return groups;
  }, [filterGroups]);

  const handleCheckFilterChange = (key: string, value: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      const currentSelected = prev[key];

      if (!currentSelected) {
        return { ...prev, [key]: checked ? [value] : undefined };
      }

      if (Array.isArray(currentSelected)) {
        if (checked && !currentSelected.includes(value)) {
          return { ...prev, [key]: [...currentSelected, value] };
        }

        if (!checked && currentSelected.includes(value)) {
          const newValues = currentSelected.filter((v) => v !== value);
          return {
            ...prev,
            [key]: newValues.length > 0 ? newValues : undefined,
          };
        }
      }

      return prev;
    });
  };

  const clearGroup = (key: string) => {
    setSelectedFilters((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleCustomFilterSelection = useCallback((key: string, values: string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: values.length > 0 ? values : undefined,
    }));
  }, []);

  /**
   * Calculates the total number of active filters
   */
  const totalActiveFilters = useMemo(() => {
    return Object.values(selectedFilters).filter(
      (value) =>
        value !== undefined &&
        value !== '' &&
        (typeof value !== 'string' || value.length > 0) &&
        (!Array.isArray(value) || value.length > 0),
    ).length;
  }, [selectedFilters]);

  /**
   * Applies current filter selections to URL parameters
   */
  const handleApply = () => {
    const newFilters = { ...filters };

    // Remove any keys that are managed by this component
    availableFilterKeys.forEach((key) => {
      delete newFilters[key];
    });

    // Combine with selected filters
    Object.assign(newFilters, selectedFilters);

    // Remove any undefined or empty filters
    Object.keys(newFilters).forEach((key) => {
      const value = newFilters[key];
      if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
        delete newFilters[key];
      }
    });

    setQueryParams({
      filters: newFilters,
      pageIndex: 0,
    });
    setIsFiltersOpen(false);
  };

  /**
   * Clears all filter selections
   */
  const handleClearAll = () => {
    setSelectedFilters({});

    const preservedFilters = { ...filters };

    // Remove managed filters
    availableFilterKeys.forEach((key) => {
      delete preservedFilters[key];
    });

    setQueryParams({
      filters: preservedFilters,
      pageIndex: 0,
    });
  };

  const getSelectedCountForCustomFilter = (groupKey: string) => {
    return selectedFilters[groupKey]?.length || 0;
  };

  const getSelectedCountForCheckboxGroup = (groupKey: string) => {
    const options = groupedOptions[groupKey]?.options || [];
    const uniqueKeys = [...new Set(options.map((option) => option.key))];

    return uniqueKeys.reduce((totalCount, key) => {
      const selectedValues = selectedFilters[key];
      if (!selectedValues) return totalCount;

      if (Array.isArray(selectedValues)) {
        return totalCount + selectedValues.length;
      }

      return totalCount + (selectedValues ? 1 : 0);
    }, 0);
  };

  return (
    <div className="relative">
      <DropdownMenu open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <div className="flex justify-center items-center gap-2 text-text-primary font-normal">
              <FilterIcon className="size-6" />
              <p className="text-sm">Filters</p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
          {/* Custom Filter Components */}
          {filterGroups
            .filter((group) => !!group.component)
            .map((group) => (
              <DropdownMenuSub
                key={group.key}
                open={openSubMenu === group.name}
                onOpenChange={(open) => handleSubMenuOpenChange(group.name, open)}
              >
                <DropdownMenuSubTrigger
                  groupCount={
                    getSelectedCountForCustomFilter(group.key) > 0
                      ? getSelectedCountForCustomFilter(group.key)
                      : undefined
                  }
                >
                  {group.name}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-56 max-h-64 overflow-y-auto">
                    {group.component && (
                      <group.component
                        selectedValues={(selectedFilters[group.key] as string[]) || []}
                        onSelectionChange={(values) =>
                          handleCustomFilterSelection(group.key, values)
                        }
                        isOpen={openSubMenu === group.name}
                        onClearGroup={() => clearGroup(group.key)}
                      />
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ))}

          {/* Checkbox Filter Groups */}
          {Object.entries(groupedOptions).map(([groupKey, { name, options }]) => (
            <DropdownMenuSub
              key={groupKey}
              open={openSubMenu === name}
              onOpenChange={(open) => handleSubMenuOpenChange(name, open)}
            >
              <DropdownMenuSubTrigger
                groupCount={
                  getSelectedCountForCheckboxGroup(groupKey) > 0
                    ? getSelectedCountForCheckboxGroup(groupKey)
                    : undefined
                }
              >
                {name}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-56 max-h-64 overflow-y-auto">
                  <CheckboxFilterGroup
                    options={options}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleCheckFilterChange}
                    onClearGroup={() => clearGroup(groupKey)}
                  />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}

          <DropdownMenuSeparator className="my-4" />

          {/* Apply and Clear buttons */}
          <div className="flex justify-between items-center text-xs p-2">
            <Button onClick={handleApply}>Apply filters</Button>
            <Button
              variant="link"
              className="size-fit p-0 text-xs"
              onClick={handleClearAll}
              disabled={totalActiveFilters === 0}
            >
              Clear all
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Badge showing number of active filters */}
      {totalActiveFilters > 0 && (
        <Chip className="absolute -left-1 -top-1 h-[18px] w-[18px] text-xs">
          {totalActiveFilters}
        </Chip>
      )}
    </div>
  );
};

export { DropdownFilters };
