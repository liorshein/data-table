import React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DropdownOption, DropdownVariant } from '@/lib/dropdown';

type DropdownRadioProps = {
  /** Array of options to display in the dropdown */
  options: DropdownOption[];
  /** Currently selected value */
  value: string;
  /** Callback function when selection changes */
  onChange: (value: string) => void;
  /** Optional placeholder text for the dropdown button */
  placeholder?: string;
  /** Visual variant of the dropdown button */
  variant?: DropdownVariant;
  /** Optional custom trigger button component */
  triggerButton?: React.ReactNode;
};

/**
 * Dropdown Radio Component
 *
 * A single-select dropdown component that supports:
 * - Exclusive selection with radio buttons
 * - Controlled selection state
 * - Custom button variants
 * - Simple and clean interface
 * - Custom trigger button
 */
const DropdownRadio = ({
  options,
  value,
  onChange,
  variant = 'default',
  placeholder = 'Select an option',
  triggerButton,
}: DropdownRadioProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="group">
        {triggerButton ? triggerButton : <Button variant={variant}>{placeholder}</Button>}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { DropdownRadio };
