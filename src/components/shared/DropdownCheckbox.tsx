import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  DropdownOption,
  DropdownVariant,
  getGroupOptions,
  getUngroupedOptions,
} from '@/lib/dropdown';

type DropdownCheckboxProps = {
  /** Array of options to display in the dropdown */
  options: DropdownOption[];
  /** Currently selected values */
  value: string[];
  /** Callback function when selection changes */
  onChange: (value: string[]) => void;
  /** Optional placeholder text for the dropdown button */
  placeholder?: string;
  /** Visual variant of the dropdown button */
  variant?: DropdownVariant;
  /** Optional alignment of content */
  align?: 'center' | 'end' | 'start';
  /** Whether to hide the clear all top section */
  hideClear?: boolean;
  /** Optional custom trigger button component */
  triggerButton?: React.ReactNode;
};

/**
 * Dropdown Checkbox Component
 *
 * A multi-select dropdown component that supports:
 * - Multiple item selection with checkboxes
 * - Grouped and ungrouped options
 * - Visual feedback for selected groups
 * - Controlled selection state
 * - Custom trigger button
 */
const DropdownCheckbox = ({
  options,
  value,
  onChange,
  variant = 'default',
  align = 'start',
  placeholder = 'Select options',
  hideClear = false,
  triggerButton,
}: DropdownCheckboxProps) => {
  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue];

    if (newValue.length > 0) {
      onChange(newValue);
    } else {
      onChange([]);
    }
  };

  const groupedOptions = useMemo(() => getGroupOptions(options), [options]);
  const ungroupedOptions = useMemo(() => getUngroupedOptions(options), [options]);

  const clearGroup = (groupOptions: DropdownOption[]) => {
    const groupValues = groupOptions.map((option) => option.value);
    const newValue = value.filter((item) => !groupValues.includes(item));

    if (newValue.length > 0) {
      onChange(newValue);
    } else {
      onChange([]);
    }
  };

  const getGroupSelectedCount = (groupOptions: DropdownOption[]) => {
    return groupOptions.filter((option) => value.includes(option.value)).length;
  };

  const renderCheckboxItem = (option: DropdownOption) => (
    <DropdownMenuCheckboxItem
      key={option.value}
      onCheckedChange={() => handleSelect(option.value)}
      checked={value.includes(option.value)}
      onSelect={(event) => event.preventDefault()}
    >
      {option.label}
    </DropdownMenuCheckboxItem>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="group">
        {triggerButton ? triggerButton : <Button variant={variant}>{placeholder}</Button>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56">
        {!hideClear && (
          <>
            <div className="flex justify-between text-xs">
              <div className="text-tertiary">{`(${value.length}) Selected`}</div>
              <Button
                disabled={value.length === 0}
                variant="link"
                className="size-fit p-0 text-xs"
                onClick={() => onChange([])}
              >
                Clear all
              </Button>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        {ungroupedOptions.map(renderCheckboxItem)}
        {Object.entries(groupedOptions).map(([groupName, groupOptions]) => {
          const isGroupSelected = groupOptions.some((option) => value.includes(option.value));
          const groupSelectedCount = getGroupSelectedCount(groupOptions);
          return (
            <DropdownMenuSub key={groupName}>
              <DropdownMenuSubTrigger className={isGroupSelected ? 'bg-black-200' : ''}>
                {groupName}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-56">
                  {!hideClear && (
                    <>
                      <div className="flex justify-between text-xs">
                        <div className="text-tertiary">
                          {`(${groupSelectedCount}/${groupOptions.length}) Selected`}
                        </div>
                        <Button
                          variant="link"
                          className="size-fit p-0 text-xs"
                          disabled={!isGroupSelected}
                          onClick={() => {
                            clearGroup(groupOptions);
                          }}
                        >
                          Clear all
                        </Button>
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {groupOptions.map(renderCheckboxItem)}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { DropdownCheckbox };
