import { Cell, flexRender, Table } from '@tanstack/react-table';

import { ExtendedColumnDef } from '@/components/shared/data-table';
import { LoadingState } from '@/components/shared/data-table/table-content/components/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { TableBody as BaseTableBody, TableCell, TableRow } from '@/components/ui/table';
import { calculatePinnedOffset, createStyles } from '@/lib/dataTable';
import { cn } from '@/lib/utils';

type TableBodyProps<TData> = {
  /** The table instance from TanStack Table */
  table: Table<TData>;
  /** Optional callback function when a row is clicked, receives the row data */
  onRowClick?: (rowData: TData) => void;
  /** Flag to disable row click interactions */
  disableRowClick: boolean;
  /** Flag to show loading state with skeleton rows */
  isLoading?: boolean;
  /** Optional empty state overlay */
  noRowsOverlay?: React.ReactNode;
};

const TableBody = <TData,>({
  table,
  isLoading,
  onRowClick,
  disableRowClick,
  noRowsOverlay,
}: TableBodyProps<TData>) => {
  const getCellStyle = (cell: Cell<TData, unknown>) => {
    const columnDef = cell.column.columnDef as ExtendedColumnDef<TData>;
    const direction = columnDef.pinned === 'right' ? 'right' : 'left';
    return createStyles({
      isPinned: columnDef.pinned,
      direction,
      width: columnDef.id === 'placeholder' ? undefined : cell.column.getSize(),
      minWidth: cell.column.columnDef.minSize,
      offset: calculatePinnedOffset(
        cell.column.id,
        direction,
        table.getState().columnPinning,
        table.getState().columnSizing,
        table._getDefaultColumnDef().size,
      ),
    });
  };

  return (
    <BaseTableBody>
      {isLoading ? (
        <LoadingState table={table} />
      ) : table.getRowModel().rows.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && 'selected'}
            onClick={(e) => {
              if (disableRowClick) return;
              const isActionsCell = (e.target as HTMLElement).closest('[data-cell-actions]');
              const isCheckboxCell = (e.target as HTMLElement).closest('[data-cell-checkbox]');
              if (onRowClick && !isActionsCell && !isCheckboxCell) {
                onRowClick(row.original);
              }
            }}
            className={cn(disableRowClick && 'hover:cursor-default')}
          >
            {row.getVisibleCells().map((cell) => {
              const isActionsCell = cell.column.id === 'actions';
              return (
                <TableCell
                  key={cell.id}
                  className="truncate"
                  style={getCellStyle(cell)}
                  {...(isActionsCell && { 'data-cell-actions': true })}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              );
            })}
          </TableRow>
        ))
      ) : (
        <TableRow className="hover:bg-transparent hover:cursor-default">
          <TableCell colSpan={table.getAllColumns().length}>
            {noRowsOverlay ? noRowsOverlay : <EmptyState className="h-64" />}
          </TableCell>
        </TableRow>
      )}
    </BaseTableBody>
  );
};

export { TableBody };
