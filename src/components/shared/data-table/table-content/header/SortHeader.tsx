import { Column } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { IconSortAsc, IconSortDefault, IconSortDesc } from '@/icons';
import { cn } from '@/lib/utils';

type SortHeaderProps<TData> = {
  /** The column instance from TanStack Table that handles sorting logic */
  column: Column<TData>;
  /** The text to display in the header */
  title: string;
  /** Optional CSS classes to apply to the header */
  className?: string;
};

/**
 * A sortable header component for table columns that provides:
 * - Click to sort functionality
 * - Visual indicators for sort direction
 * - Graceful fallback for non-sortable columns
 */
const SortHeader = <TData,>({ column, title, className }: SortHeaderProps<TData>) => {
  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>;
  }

  const sorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('h-8 px-0 active:bg-transparent hover:bg-transparent cursor-pointer', className)}
      onClick={() => column.toggleSorting()}
    >
      {title}
      {sorted ? (
        sorted === 'asc' ? (
          <IconSortAsc className="size-4 text-primary" />
        ) : (
          <IconSortDesc className="size-4 text-primary" />
        )
      ) : (
        <IconSortDefault className="size-4 text-muted-foreground" />
      )}
    </Button>
  );
};

export { SortHeader };
