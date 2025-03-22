import { PopoverProps } from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { JSX } from 'react';

type DatePickerProps = PopoverProps & {
  /** Current date value */
  value?: Date;
  /** Callback function called when the selected date changes */
  onChange: (date: Date | undefined) => void;
  /**
   * Optional placeholder text when no date is selected.
   *
   * @defaultValue "Pick a date"
   */
  placeholder?: string;
  /**
   * Whether the date range picker is disabled.
   *
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Show the outside days.  An outside day is a day falling in the next or the
   * previous month.
   *
   * @defaultValue false
   */
  showOutsideDays?: boolean;
  /** Optional button className for styling */
  buttonClassName?: string;
  /** Optionally render a custom popover trigger component (currently for form usage) */
  renderTrigger?: () => JSX.Element;
};

/**
 * Date Picker Component
 *
 * A controlled date picker component that provides a clean interface for date selection.
 */
const DatePicker = ({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  showOutsideDays = false,
  buttonClassName,
  renderTrigger,
  ...props
}: DatePickerProps) => {
  return (
    <Popover {...props}>
      {renderTrigger ? (
        renderTrigger()
      ) : (
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            className={cn(
              'justify-start text-left font-normal',
              !value && 'text-muted-foreground',
              disabled && 'opacity-50 cursor-not-allowed',
              buttonClassName,
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              <>
                {format(value, 'PPP')}
                <span
                  className="ml-2 h-4 w-4 p-0 inline-flex items-center justify-center hover:bg-gray-200 rounded-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(undefined);
                  }}
                >
                  <X className="h-3 w-3" />
                </span>
              </>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
      )}
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          disabled={disabled}
          showOutsideDays={showOutsideDays}
        />
      </PopoverContent>
    </Popover>
  );
};

export { DatePicker };
export type { DatePickerProps };
