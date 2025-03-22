import { PopoverProps } from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { JSX } from 'react';

type DateRangePickerProps = PopoverProps & {
  /** Current date range value */
  value?: DateRange;
  /** Array of dates that should be disabled/unselectable */
  disabledDates?: Date[];
  /** Callback function called when the selected date range changes */
  onChange: (range: DateRange | undefined) => void;
  /**
   * Optional placeholder text when no date is selected.
   *
   * @defaultValue "Pick a date range"
   */
  placeholder?: string;
  /**
   * Number of months to display in the calendar.
   *
   * @defaultValue 2
   */
  numberOfMonths?: number;
  /**
   * Whether the date range picker is disabled.
   *
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Show the outside days.
   *
   * An outside day is a day falling in the next or the previous month.
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
 * Date Range Picker Component
 *
 * A controlled date range picker component that allows users to select a date range using a calendar interface.
 */
const DateRangePicker = ({
  value,
  disabledDates,
  onChange,
  placeholder = 'Pick a range',
  numberOfMonths = 2,
  disabled = false,
  showOutsideDays = false,
  buttonClassName,
  renderTrigger,
  ...props
}: DateRangePickerProps) => {
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
            {value?.from ? (
              <>
                {value.to ? (
                  <>
                    {format(value.from, 'LLL dd, y')} - {format(value.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(value.from, 'LLL dd, y')
                )}
                <span
                  className="ml-2 h-4 w-4 p-0 inline-flex items-center justify-center hover:bg-gray-200 rounded-sm"
                  onClick={() => {
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
          initialFocus
          mode="range"
          defaultMonth={new Date()}
          selected={value}
          onSelect={onChange}
          numberOfMonths={numberOfMonths}
          disabled={disabledDates}
          showOutsideDays={showOutsideDays}
        />
      </PopoverContent>
    </Popover>
  );
};

export { DateRangePicker };
