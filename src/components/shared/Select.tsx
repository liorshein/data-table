import { VariantProps } from 'class-variance-authority';

import { buttonVariants } from '@/components/ui/button';
import {
  Select as BaseSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JSX } from 'react';

type SelectOption = {
  label: string;
  /** Unique identifier for the option */
  value: string;
  /** Whether the option is disabled */
  disabled?: boolean;
};

type SelectProps = {
  options: SelectOption[];
  value: string;
  /** Callback when selection changes */
  onChange: (value: string) => void;
  /** Placeholder text when no option is selected */
  placeholder?: string;
  /** Whether the entire select is disabled */
  disabled?: boolean;
  /** Optional trigger button variant */
  variant?: VariantProps<typeof buttonVariants>['variant'];
  /** Optional trigger button className for styling */
  triggerClassName?: string;
  /** Optionally render a custom input component (currently for form usage) */
  renderTrigger?: () => JSX.Element;
};

/**
 * Select Component
 *
 * A simplified select component built on top of shadcn/ui select.
 *
 * Provides a clean interface for creating dropdowns with options array.
 */
const Select = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  variant,
  triggerClassName,
  renderTrigger,
}: SelectProps) => {
  return (
    <BaseSelect value={value} onValueChange={onChange} disabled={disabled}>
      {renderTrigger ? (
        renderTrigger()
      ) : (
        <SelectTrigger variant={variant} className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      )}
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </BaseSelect>
  );
};

export { Select, type SelectOption };
