import { Table } from '@tanstack/react-table';

import { ExtendedColumnDef } from '@/components/shared/data-table';
import { TableCell, TableRow } from '@/components/ui/table';
import { calculatePinnedOffset, createStyles } from '@/lib/dataTable';

type LoadingStateProps<TData> = {
  /** The table instance from TanStack Table */
  table: Table<TData>;
};

const LoadingState = <TData,>({ table }: LoadingStateProps<TData>) => {
  return Array(5)
    .fill(null)
    .map((_, rowIndex) => (
      <TableRow key={rowIndex} className="hover:cursor-default hover:bg-inherit">
        {table.getAllColumns().map((column) => {
          const columnDef = column.columnDef as ExtendedColumnDef<TData>;
          const direction = columnDef.pinned === 'right' ? 'right' : 'left';

          const style = createStyles({
            isPinned: columnDef.pinned,
            direction,
            width: columnDef.id === 'placeholder' ? undefined : column.getSize(),
            minWidth: column.columnDef.minSize,
            offset: calculatePinnedOffset(
              column.id,
              direction,
              table.getState().columnPinning,
              table.getState().columnSizing,
              table._getDefaultColumnDef().size,
            ),
          });

          return (
            <TableCell key={column.id} style={style} className="truncate">
              <div className="h-4 rounded bg-secondary animate-pulse" />
            </TableCell>
          );
        })}
      </TableRow>
    ));
};

export { LoadingState };
