import React, { useMemo } from 'react';

import { AutocompleteFilter } from '@/components/shared/filters-dropdown/AutocompleteFilter';
import { CheckboxFilter } from '@/components/shared/filters-dropdown/CheckboxFilter';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DropdownVariant } from '@/lib/dropdown';
import { Filter } from 'lucide-react';

type FilterType = 'checkbox' | 'autocomplete';

type FilterOption = {
  /** Filter's key to match the value to */
  key: string;
  /** Group text label shown in the dropdown */
  group: string;
  /** Unique value for the option */
  value: string;
  /** Text label shown in the dropdown */
  label: string;
  /** Filter component type */
  type: FilterType;
  /** For autocomplete, list of available options */
  options?: Array<{ label: string; value: string }>;
};

type FilterValue = string[] | string | undefined;
type FiltersObj = Record<string, FilterValue>;

type FilterComponentProps = {
  option: FilterOption;
  groupKey: string;
  value: FiltersObj;
  onChange: (key: string, optionValue: string | string[]) => void;
  isSelected: boolean;
};

type FiltersDropdownProps = {
  /** Array of options to display in the dropdown */
  options: FilterOption[];
  /** Currently selected values */
  value?: FiltersObj;
  /** Callback function when selection changes */
  onChange: (value: FiltersObj) => void;
  /** Callback function when applying changes */
  onApply: () => void;
  /** Callback function when clearing all filters */
  onClearAll: () => void;
  /** Callback function when clearing group filters */
  onClearGroup: (key: string) => void;
  /** Optional placeholder text for the dropdown button */
  placeholder?: React.ReactNode;
  /** Visual variant of the dropdown button */
  variant?: DropdownVariant;
};

/**
 * Filters Dropdown Component
 *
 * A multi-select dropdown component that supports:
 * - Multiple item selection with various filter types (checkbox, autocomplete, etc.)
 * - Grouped options
 * - Visual feedback for selected groups
 * - Controlled selection state and applying filters
 */
const FiltersDropdown = ({
  options,
  value = {},
  onChange,
  onApply,
  onClearGroup,
  onClearAll,
  variant = 'default',
  placeholder,
}: FiltersDropdownProps) => {
  const defaultFilterRenderers: Record<FilterType, React.FC<FilterComponentProps>> = {
    checkbox: CheckboxFilter,
    autocomplete: AutocompleteFilter,
  };

  const handleFilterChange = (key: string, optionValue: string | string[]) => {
    const newValue = {
      ...(value || {}),
    };

    if (Array.isArray(optionValue)) {
      // Handle array values (e.g., range filters)
      if (optionValue.some((v) => v !== '')) {
        newValue[key] = optionValue;
      } else {
        newValue[key] = undefined; // Set to undefined if all values are empty
      }
    } else if (typeof optionValue === 'string') {
      // Handle single string values
      const currentValueRaw = value?.[key];
      const currentValue = Array.isArray(currentValueRaw)
        ? currentValueRaw
        : typeof currentValueRaw === 'string'
          ? [currentValueRaw]
          : [];

      // For checkbox filters: toggle the value
      if (
        options.find((opt) => opt.key === key && opt.value === optionValue)?.type === 'checkbox'
      ) {
        const updatedValue = currentValue.includes(optionValue)
          ? currentValue.filter((item) => item !== optionValue)
          : [...currentValue, optionValue];

        if (updatedValue.length > 0) {
          newValue[key] = updatedValue.length === 1 ? updatedValue[0] : updatedValue;
        } else {
          newValue[key] = undefined;
        }
      } else {
        // For other filters (autocomplete, date): set the value directly
        if (optionValue) {
          newValue[key] = optionValue;
        } else {
          newValue[key] = undefined;
        }
      }
    }

    onChange(newValue);
  };

  const groupedOptions = useMemo(() => {
    return options.reduce(
      (acc, option) => {
        if (!acc[option.group]) {
          acc[option.group] = [];
        }
        acc[option.group].push(option);
        return acc;
      },
      {} as Record<string, FilterOption[]>,
    );
  }, [options]);

  const clearGroup = (groupKey: string) => {
    const newValue = { ...(value || {}) };
    newValue[groupKey] = undefined; // Set to undefined instead of deleting
    onChange(newValue);
    onClearGroup(groupKey);
  };

  const getGroupSelectedCount = (groupKey: string, groupOptions: FilterOption[]) => {
    const currentValue = value?.[groupKey];
    if (!currentValue) return 0;

    // For non-checkbox filters, count as 1 if there's any value
    const nonCheckboxOptions = groupOptions.filter(
      (opt) => opt.type && opt.type !== 'checkbox' && opt.key === groupKey,
    );

    if (nonCheckboxOptions.length > 0 && currentValue) {
      return 1;
    }

    // For checkbox filters, count selected items
    if (Array.isArray(currentValue)) {
      return groupOptions.filter((option) => currentValue.includes(option.value)).length;
    }
    return groupOptions.filter((option) => currentValue === option.value).length;
  };

  const renderFilterItem = (groupKey: string, option: FilterOption) => {
    const currentValue = value?.[groupKey];
    const isSelected = Array.isArray(currentValue)
      ? currentValue.includes(option.value)
      : currentValue === option.value;

    const FilterComponent = defaultFilterRenderers[option.type || 'checkbox'];

    return (
      <div key={option.value}>
        <FilterComponent
          option={option}
          groupKey={groupKey}
          value={value}
          onChange={handleFilterChange}
          isSelected={isSelected}
        />
      </div>
    );
  };

  const totalActiveFilters = useMemo(() => {
    return Object.values(value || {}).filter(
      (v) => v !== undefined && (typeof v === 'string' || (Array.isArray(v) && v.length > 0)),
    ).length;
  }, [value]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant}>
          {placeholder ? (
            placeholder
          ) : (
            <div className="flex justify-center items-center gap-2 text-text-primary font-normal">
              <Filter className="size-6" />
              <p className="text-sm">Filters</p>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
        {Object.entries(groupedOptions).map(([groupName, groupOptions]) => {
          const groupKey = groupOptions[0].key;
          const isGroupSelected =
            value &&
            value[groupKey] &&
            (typeof value[groupKey] === 'string' ||
              (Array.isArray(value[groupKey]) && value[groupKey].length > 0));
          const groupSelectedCount = getGroupSelectedCount(groupKey, groupOptions);

          return (
            <DropdownMenuSub key={groupName}>
              <DropdownMenuSubTrigger groupCount={isGroupSelected ? groupSelectedCount : undefined}>
                {groupName}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-56 max-h-64 overflow-y-auto">
                  <div className="flex justify-between text-xs p-2">
                    <div className="text-tertiary">
                      {`(${groupSelectedCount}/${groupOptions.length}) Selected`}
                    </div>
                    <Button
                      variant="link"
                      className="size-fit p-0 text-xs"
                      disabled={groupSelectedCount === 0}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        clearGroup(groupKey);
                      }}
                    >
                      Clear all
                    </Button>
                  </div>
                  <DropdownMenuSeparator />
                  {groupOptions.map((option) => renderFilterItem(groupKey, option))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          );
        })}
        <DropdownMenuSeparator />
        <div className="flex justify-between items-center text-xs p-2">
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onApply();
            }}
          >
            Apply filters
          </Button>
          <Button
            variant="link"
            className="size-fit p-0 text-xs"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClearAll();
            }}
            disabled={totalActiveFilters === 0}
          >
            Clear all
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export {
  type FilterComponentProps,
  type FilterOption,
  FiltersDropdown,
  type FiltersObj,
  type FilterType,
  type FilterValue,
};
