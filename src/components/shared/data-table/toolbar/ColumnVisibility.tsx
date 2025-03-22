import { Table } from '@tanstack/react-table';

import { ExtendedColumnDef } from '@/components/shared/data-table';
import { DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';

type ColumnVisibilityProps<TData> = {
  /** The table instance from TanStack Table */
  table: Table<TData>;
};

/**
 * A component that provides column visibility controls for tables with features:
 * - Toggle individual columns
 * - Multi-select column visibility
 * - Preserves non-hideable columns
 * - Only shows toggleable columns in the dropdown
 */
const ColumnVisibility = <TData,>({ table }: ColumnVisibilityProps<TData>) => {
  const toggleableColumns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide());

  return (
    <>
      {toggleableColumns.map((column) => (
        <DropdownMenuCheckboxItem
          key={column.id}
          checked={column.getIsVisible()}
          onCheckedChange={(checked) => column.toggleVisibility(!!checked)}
          onSelect={(e) => e.preventDefault()}
        >
          {(column.columnDef as ExtendedColumnDef<TData>).displayLabel || column.id}
        </DropdownMenuCheckboxItem>
      ))}
    </>
  );
};

export { ColumnVisibility };
