import {
  Button,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  FilterOption,
  FiltersObj,
} from '@/components';

type CheckboxFilterGroupProps = {
  /** List of filter options to display */
  options: FilterOption[];
  /** Object containing currently selected filters */
  selectedFilters: FiltersObj;
  /** Callback when a filter checkbox is toggled */
  onFilterChange: (key: string, value: string, checked: boolean) => void;
  /** Callback to clear all selected filters in this group */
  onClearGroup: () => void;
};

/**
 * Renders a group of checkbox filters with selection tracking and clear functionality
 */
const CheckboxFilterGroup = ({
  options,
  selectedFilters,
  onFilterChange,
  onClearGroup,
}: CheckboxFilterGroupProps) => {
  const groupKey = options[0]?.key;

  // Calculate selected count
  const getSelectedCount = () => {
    if (!groupKey || !selectedFilters[groupKey]) return 0;

    const selectedValues = selectedFilters[groupKey] as string[];
    if (!Array.isArray(selectedValues)) return selectedValues ? 1 : 0;

    return selectedValues.length;
  };

  const selectedCount = getSelectedCount();

  // Check if a value is selected
  const isFilterSelected = (key: string, value: string) => {
    const selected = selectedFilters[key];
    if (!selected) return false;

    if (Array.isArray(selected)) {
      return selected.includes(value);
    }

    return selected === value;
  };

  return (
    <>
      <div className="flex justify-between text-xs p-2">
        <div className="text-tertiary">{`(${selectedCount}/${options.length}) Selected`}</div>
        <Button
          variant="link"
          className="size-fit p-0 text-xs"
          disabled={selectedCount === 0}
          onClick={onClearGroup}
        >
          Clear all
        </Button>
      </div>
      <DropdownMenuSeparator />
      {options.map((option) => (
        <DropdownMenuCheckboxItem
          key={`${option.key}-${option.value}`}
          onCheckedChange={(checked) =>
            onFilterChange(option.key, option.value.toString(), checked)
          }
          checked={isFilterSelected(option.key, option.value.toString())}
          onSelect={(event) => event.preventDefault()}
        >
          {option.label}
        </DropdownMenuCheckboxItem>
      ))}
    </>
  );
};

export { CheckboxFilterGroup };
