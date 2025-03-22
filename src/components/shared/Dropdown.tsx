import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
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

type DropdownProps = {
  /** Array of options to display in the dropdown */
  options: DropdownOption[];
  /** Optional placeholder text for the dropdown button */
  placeholder?: string;
  /** Visual variant of the dropdown button */
  variant?: DropdownVariant;
  /** Optional alignment of content */
  align?: 'center' | 'end' | 'start';
  /** Optional custom trigger button component */
  triggerButton?: React.ReactNode;
};

/**
 * Dropdown Component
 *
 * A customizable dropdown menu that supports:
 * - Grouped and ungrouped options
 * - Custom icons
 * - Multiple visual variants
 * - Nested submenus for groups
 * - Custom trigger button
 */
const Dropdown = ({
  options,
  variant = 'default',
  placeholder = 'Select an option',
  align = 'start',
  triggerButton,
}: DropdownProps) => {
  const groupedOptions = useMemo(() => getGroupOptions(options), [options]);
  const ungroupedOptions = useMemo(() => getUngroupedOptions(options), [options]);

  const renderMenuItem = (option: DropdownOption) => (
    <DropdownMenuItem key={option.value} onClick={option.onClick}>
      {option.icon && <span className="mr-2">{option.icon}</span>}
      {option.label}
    </DropdownMenuItem>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="group">
        {triggerButton ? triggerButton : <Button variant={variant}>{placeholder}</Button>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-max">
        {ungroupedOptions.map(renderMenuItem)}
        {Object.entries(groupedOptions).map(([groupName, groupOptions]) => {
          return (
            <DropdownMenuSub key={groupName}>
              <DropdownMenuSubTrigger>{groupName}</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-56">
                  {groupOptions.map(renderMenuItem)}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { Dropdown };
