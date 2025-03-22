import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FloatBarProps<TData> = {
  /** The table instance from TanStack Table */
  table: Table<TData>;
  /** Function that renders action buttons with access to selected rows state */
  renderActionButtons: (selectedRows: TData[], resetSelection: () => void) => React.ReactNode[];
};

/**
 * FloatBar Component
 *
 * A floating action bar that appears when table rows are selected.
 * Provides quick actions for selected items including:
 * - Dynamic action buttons that can access the selected row data
 * - Canceling selection
 */
const FloatBar = <TData,>({ table, renderActionButtons }: FloatBarProps<TData>) => {
  const selectedIds = Object.keys(table.getState().rowSelection);
  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original as TData);

  const resetSelection = () => {
    table.resetRowSelection();
  };

  return (
    <div
      className={cn(
        'z-50 absolute left-1/2 bottom-2 -translate-x-1/2',
        'flex justify-between items-center gap-4',
        'p-6 rounded-xl border bg-white shadow',
        'transition-all duration-200',
        'data-[state=closed]:opacity-0 data-[state=closed]:translate-y-2 data-[state=closed]:pointer-events-none',
        'data-[state=open]:opacity-100 data-[state=open]:translate-y-0',
        selectedIds.length === 0 && 'data-[state=closed]',
      )}
      data-state={selectedIds.length > 0 ? 'open' : 'closed'}
    >
      <p className="text-xs text-nowrap text-muted-foreground">{`${selectedIds.length} items selected`}</p>
      <div className="flex justify-between items-center gap-2">
        <Button variant="destructive" onClick={resetSelection}>
          Cancel
        </Button>
        {renderActionButtons(selectedRows, resetSelection)}
      </div>
    </div>
  );
};

export { FloatBar };
