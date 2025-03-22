import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps<TData> = {
  /** The table instance from TanStack Table */
  table: Table<TData>;
  /** Total rows count (from backend) */
  rowCount: number;
  /** Optional array of page size options to show in the dropdown */
  pageSizeOptions?: number[];
};

/**
 * A pagination component for tables that provides:
 * - Page size selection
 * - Page navigation
 * - Selected rows count
 * - Dynamic page number rendering
 */
const Pagination = <TData,>({
  table,
  rowCount,
  pageSizeOptions = [5, 10, 20],
}: PaginationProps<TData>) => {
  const renderPageNumbers = () => {
    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = table.getPageCount();
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        items.push(
          <Button
            key={i}
            variant={currentPage === i ? 'secondary' : 'ghost'}
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(i)}
          >
            {i + 1}
          </Button>,
        );
      }
    } else {
      items.push(
        <Button
          key={0}
          variant={currentPage === 0 ? 'secondary' : 'ghost'}
          className="h-8 w-8 p-0"
          onClick={() => table.setPageIndex(0)}
        >
          1
        </Button>,
      );

      if (currentPage > 2) {
        items.push(
          <span key="ellipsis-start" className="px-2">
            ...
          </span>,
        );
      }

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      if (currentPage <= 2) {
        for (let i = 1; i <= 2; i++) {
          items.push(
            <Button
              key={i}
              variant={currentPage === i ? 'secondary' : 'ghost'}
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(i)}
            >
              {i + 1}
            </Button>,
          );
        }
      } else if (currentPage >= totalPages - 3) {
        for (let i = totalPages - 3; i <= totalPages - 2; i++) {
          items.push(
            <Button
              key={i}
              variant={currentPage === i ? 'secondary' : 'ghost'}
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(i)}
            >
              {i + 1}
            </Button>,
          );
        }
      } else {
        for (let i = start; i <= end; i++) {
          items.push(
            <Button
              key={i}
              variant={currentPage === i ? 'secondary' : 'ghost'}
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(i)}
            >
              {i + 1}
            </Button>,
          );
        }
      }

      if (currentPage < totalPages - 3) {
        items.push(
          <span key="ellipsis-end" className="px-2">
            ...
          </span>,
        );
      }

      items.push(
        <Button
          key={totalPages - 1}
          variant={currentPage === totalPages - 1 ? 'secondary' : 'ghost'}
          className="h-8 w-8 p-0"
          onClick={() => table.setPageIndex(totalPages - 1)}
        >
          {totalPages}
        </Button>,
      );
    }

    return items;
  };

  return (
    <>
      <Select
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => {
          table.setPageSize(Number(value));
        }}
      >
        <SelectTrigger className="h-8 w-20">
          <SelectValue placeholder={table.getState().pagination.pageSize} />
        </SelectTrigger>
        <SelectContent side="top">
          {pageSizeOptions.map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
        {Math.min(
          (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
          rowCount,
        )}{' '}
        from {rowCount} rows
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" />
          </Button>
          {renderPageNumbers()}
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export { Pagination };
