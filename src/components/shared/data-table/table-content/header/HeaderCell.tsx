import { flexRender, Header } from '@tanstack/react-table';

import { ExtendedColumnDef } from '@/components/shared/data-table';
import { TableHead } from '@/components/ui/table';
import { cn } from '@/lib/utils';

type HeaderCellProps<TData> = {
  /** The header instance from TanStack Table */
  header: Header<TData, unknown>;
  /** Extended column definition*/
  columnDef: ExtendedColumnDef<TData>;
  /** Flag indicating if the column is currently being resized */
  isResizing: boolean;
  /** Function that returns the resize handler for the column */
  getResizeHandler: () => (event: React.MouseEvent | React.TouchEvent) => void;
  /** Function that generates the styling for the header based on its state */
  getHeaderStyle: (header: Header<TData, unknown>) => React.CSSProperties;
};

/**
 * A component that renders a table header cell with support for:
 * - Column resizing
 * - Column pinning
 * - Custom header content rendering
 * - Responsive styling
 */
const HeaderCell = <TData,>({
  header,
  columnDef,
  isResizing,
  getResizeHandler,
  getHeaderStyle,
}: HeaderCellProps<TData>) => {
  const isPinned = columnDef.pinned;

  return (
    <TableHead
      key={header.id}
      colSpan={header.colSpan}
      style={getHeaderStyle(header)}
      className={cn('relative group truncate', isResizing ? 'select-none' : '')}
    >
      {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
      {header.column.getCanResize() && !isPinned && (
        <div
          className={cn(
            'absolute top-0 right-0 h-full w-1 rounded-md',
            'cursor-col-resize',
            isResizing ? 'bg-primary' : 'group-hover:bg-secondary',
          )}
        >
          <div
            onMouseDown={getResizeHandler()}
            onTouchStart={getResizeHandler()}
            className={cn('w-full h-full rounded-md', !isResizing && 'hover:bg-primary')}
          />
        </div>
      )}
    </TableHead>
  );
};

export { HeaderCell };
