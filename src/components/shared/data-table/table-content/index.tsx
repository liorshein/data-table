import { Table } from '@tanstack/react-table';
import React from 'react';

import { TableHeader } from '@/components/shared/data-table/table-content/header';
import { TableBody } from '@/components/shared/data-table/table-content/TableBody';
import { Table as BaseTable } from '@/components/ui/table';

type TableContentProps<TData> = {
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

/**
 * A component that renders a table body with support for:
 * - Column pinning
 * - Column resizing
 * - Row selection
 * - Loading states with skeleton rows
 * - Action cells
 * - Custom cell rendering
 */
const TableContent = <TData,>({
  table,
  isLoading,
  onRowClick,
  disableRowClick,
  noRowsOverlay,
}: TableContentProps<TData>) => {
  return (
    <BaseTable>
      <TableHeader table={table} />
      <TableBody
        table={table}
        disableRowClick={disableRowClick}
        isLoading={isLoading}
        noRowsOverlay={noRowsOverlay}
        onRowClick={onRowClick}
      />
    </BaseTable>
  );
};

export { TableContent };
