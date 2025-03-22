import { Command as CommandPrimitive } from 'cmdk';
import { X } from 'lucide-react';
import { ComponentProps, JSX, useCallback, useMemo, useState } from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';

type AutoCompleteOption = {
  /** Display text for the option */
  label: string;
  /** Unique identifier for the option */
  value: string;
};

type AutoCompleteProps = {
  /** Currently selected value */
  selectedValue: string | null;
  /** Callback when selection changes */
  onSelectedValueChange: (value: string) => void;
  /** Current search input value */
  searchValue: string;
  /** Callback when search input changes */
  onSearchValueChange: (value: string) => void;
  /** Array of items to choose from */
  items: AutoCompleteOption[];
  /** Optional custom filter function */
  filterOptions?: (
    options: AutoCompleteOption[],
    state: { inputValue: string },
  ) => AutoCompleteOption[];
  /** Loading state indicator */
  isLoading?: boolean;
  /** Message to show when no items match */
  emptyMessage?: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Optional input className for styling */
  inputClassName?: string;
  /** Render a custom input component (currently for form usage) */
  renderInput?: (props: ComponentProps<typeof CommandInput>) => JSX.Element;
};

/**
 * Auto Complete Component
 *
 * A flexible autocomplete component that supports:
 * - Synchronous and asynchronous search
 * - Debounced input handling
 * - Custom filtering
 * - Loading states
 * - Keyboard navigation
 * - Clear selection
 */
const AutoComplete = ({
  selectedValue,
  onSelectedValueChange,
  searchValue,
  onSearchValueChange,
  items,
  filterOptions = (items, { inputValue: searchValue }) =>
    items.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase())),
  isLoading,
  emptyMessage = 'No items.',
  placeholder = 'Search...',
  inputClassName,
  renderInput,
}: AutoCompleteProps) => {
  const [open, setOpen] = useState(false);

  const labels = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          acc[item.value] = item.label;
          return acc;
        },
        {} as Record<string, string>,
      ),
    [items],
  );

  const reset = useCallback(() => {
    onSelectedValueChange('');
    onSearchValueChange('');
    if (!open) {
      setOpen(true);
    }
  }, [onSelectedValueChange, onSearchValueChange, open]);

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const isClickingPopover = e.relatedTarget?.closest('[cmdk-list]');
    if (!isClickingPopover && selectedValue && labels[selectedValue] !== searchValue) {
      reset();
    }
  };

  const onSelectItem = (inputValue: string) => {
    const selectedLabel = labels[inputValue] ?? '';
    onSelectedValueChange(inputValue);
    onSearchValueChange(selectedLabel);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Escape') {
      setOpen(true);
    }

    if ((event.key === 'Delete' || event.key === 'Backspace') && selectedValue) {
      reset();
      event.preventDefault();
    }
  };

  const filteredItems = useMemo(
    () => filterOptions(items, { inputValue: searchValue }),
    [items, searchValue, filterOptions],
  );

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false} onKeyDown={handleKeyDown} className="overflow-visible">
          <PopoverAnchor asChild>
            <div className="relative">
              {renderInput ? (
                renderInput({
                  value: searchValue,
                  onValueChange: onSearchValueChange,
                  onKeyDown: handleKeyDown,
                  onClick: () => setOpen(true),
                  onFocus: () => setOpen(true),
                  onBlur: onInputBlur,
                  placeholder: placeholder,
                })
              ) : (
                <CommandInput
                  value={searchValue}
                  onValueChange={onSearchValueChange}
                  onKeyDown={handleKeyDown}
                  onClick={() => setOpen(true)}
                  onFocus={() => setOpen(true)}
                  onBlur={onInputBlur}
                  placeholder={placeholder}
                  className={inputClassName}
                />
              )}
              {!!selectedValue && (
                <X
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    reset();
                    e.currentTarget.parentElement?.querySelector('input')?.focus();
                  }}
                />
              )}
            </div>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              const target = e.target as Element;
              if (target.hasAttribute('cmdk-input') || target.closest('[cmdk-input]')) {
                e.preventDefault();
              }
            }}
            className="w-[--radix-popover-trigger-width] p-0 pointer-events-auto"
          >
            <CommandList>
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}
              {filteredItems.length > 0 && !isLoading ? (
                <CommandGroup>
                  {filteredItems.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={onSelectItem}
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {!isLoading && filteredItems.length === 0 ? (
                <CommandEmpty>{emptyMessage ?? 'No items.'}</CommandEmpty>
              ) : null}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
};

export { AutoComplete, type AutoCompleteOption };
