import { Header, Table } from '@tanstack/react-table';

import { ExtendedColumnDef } from '@/components/shared/data-table';
import { HeaderCell } from '@/components/shared/data-table/table-content/header/HeaderCell';
import { TableHeader as BaseTableHeader, TableRow } from '@/components/ui/table';
import { calculatePinnedOffset, createStyles } from '@/lib/dataTable';

type TableHeaderProps<TData> = {
  /** The table instance from TanStack Table */
  table: Table<TData>;
};

const TableHeader = <TData,>({ table }: TableHeaderProps<TData>) => {
  const getHeaderStyle = (header: Header<TData, unknown>) => {
    const columnDef = header.column.columnDef as ExtendedColumnDef<TData>;
    const direction = columnDef.pinned === 'right' ? 'right' : 'left';
    return createStyles({
      isPinned: columnDef.pinned,
      direction,
      width: columnDef.id === 'placeholder' ? undefined : header.getSize(),
      offset: calculatePinnedOffset(
        header.column.id,
        direction,
        table.getState().columnPinning,
        table.getState().columnSizing,
        table._getDefaultColumnDef().size,
      ),
      isHeader: true,
    });
  };

  return (
    <BaseTableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="h-9">
          {headerGroup.headers.map((header) => (
            <HeaderCell
              key={header.id}
              header={header}
              columnDef={header.column.columnDef as ExtendedColumnDef<TData>}
              isResizing={header.column.getIsResizing()}
              getResizeHandler={header.getResizeHandler}
              getHeaderStyle={getHeaderStyle}
            />
          ))}
        </TableRow>
      ))}
    </BaseTableHeader>
  );
};

export { TableHeader };
