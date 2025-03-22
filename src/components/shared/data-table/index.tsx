import {
  ColumnDef,
  ColumnPinningState,
  ColumnSizingState,
  functionalUpdate,
  getCoreRowModel,
  getPaginationRowModel,
  OnChangeFn,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { FloatBar } from '@/components/shared/data-table/FloatBar';
import { Pagination } from '@/components/shared/data-table/Pagination';
import { TableContent } from '@/components/shared/data-table/table-content';
import { createCheckboxColumn } from '@/components/shared/data-table/table-content/components/Columns';
import { TableToolbar } from '@/components/shared/data-table/toolbar';
import { FilterOption, FiltersObj, FilterValue } from '@/components/shared/filters-dropdown';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { initializeColumnSizing, setupColumnPinningAndOrder } from '@/lib/dataTable';
import { cn } from '@/lib/utils';

export type ExportFileFormats = 'csv' | 'json'
type PinningDirection = boolean | 'left' | 'right';

type ExtendedColumnDef<TData> = ColumnDef<TData, unknown> & {
  /** Optional pinning direction for the column */
  pinned?: PinningDirection;
  displayLabel?: string;
};

type DataTableProps<TData> = {
  /** Array of column definitions */
  columns: ExtendedColumnDef<TData>[];
  /** Array of data items to display in the data table */
  data: TData[];
  /** Default column configuration */
  defaultColumn?: Partial<ColumnDef<TData, unknown>>;
  /** Flag to disable row selection functionality */
  disableRowSelection?: boolean;
  /** Flag to disable row click interactions */
  disableRowClick?: boolean;
  /** Total number of rows (used for server-side pagination) */
  rowCount: number;
  /** Current sorting state */
  sortingState: SortingState;
  /** Current pagination state */
  paginationState: PaginationState;
  /** Current column visibility state */
  visibilityState?: VisibilityState;
  /** Callback when sorting changes */
  onSortingChange: (sorting: SortingState) => void;
  /** Callback when pagination changes */
  onPaginationChange: (pagination: PaginationState) => void;
  /** Callback when filters are applied */
  onFiltersApply?: (filters: FiltersObj) => void;
  /** Callback when a row is clicked */
  onRowClick?: (rowData: TData) => void;
  /** Function to get unique row identifier */
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Array of filter options */
  filterOptions?: FilterOption[];
  /** Optional card className */
  className?: string;
  /** Current search value */
  searchValue?: string;
  /** Callback when search value changes, if doesn't exists - search field doesn't appear */
  onSearch?: (value: string) => void;
  /** Callback when export is triggered, if doesn't exists - export button doesn't appear */
  onExport?: (value: ExportFileFormats) => void;
  /** Optional additional filter components */
  additionalFilters?: React.ReactNode[];
  /** Optional action button component */
  actionButton?: React.ReactNode;
  /** Optional empty state overlay */
  noRowsOverlay?: React.ReactNode;
  /** Flag to show loading state */
  isLoading?: boolean;
  /** Action button render functions that receive selected rows data */
  floatBarActionButtons?: ((
    selectedRows: TData[],
    resetSelection: () => void,
  ) => React.ReactNode)[];
};

const DEFAULT_COLUMN = {
  minSize: 100,
  size: 200,
} as const;

/**
 * A comprehensive data table component with features including:
 * - Column pinning and resizing
 * - Row selection
 * - Pagination
 * - Sorting
 * - Custom filtering
 * - Column visibility toggle
 * - Export functionality
 * - Loading states
 * - Custom actions
 */
const DataTable = <TData,>({
  columns,
  data,
  defaultColumn = DEFAULT_COLUMN,
  disableRowSelection = false,
  disableRowClick = false,
  rowCount,
  getRowId,
  sortingState,
  paginationState,
  visibilityState = {},
  pageSizeOptions,
  filterOptions,
  searchValue,
  additionalFilters,
  actionButton,
  noRowsOverlay,
  onSortingChange,
  onPaginationChange,
  onFiltersApply,
  onRowClick,
  onSearch,
  onExport,
  isLoading,
  floatBarActionButtons,
  className,
}: DataTableProps<TData>) => {
  const tableColumns = useMemo(() => {
    const placeholderColumn = {
      id: 'placeholder',
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
    };

    if (disableRowSelection) {
      return [...columns, placeholderColumn];
    }

    const checkboxColumn = createCheckboxColumn<TData>();
    return [checkboxColumn, ...columns, placeholderColumn];
  }, [columns, disableRowSelection]);

  const initialSizing = useMemo(
    () => initializeColumnSizing(tableColumns, defaultColumn.size),
    [defaultColumn.size, tableColumns],
  );

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(initialSizing);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(visibilityState);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { initialPinning, columnOrder } = useMemo(
    () => setupColumnPinningAndOrder(tableColumns),
    [tableColumns],
  );

  const [columnPinning] = useState<ColumnPinningState>(initialPinning);

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updaterOrValue) => {
    setRowSelection(updaterOrValue);
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    const newSortState = functionalUpdate(updaterOrValue, sortingState);
    onSortingChange(newSortState);
  };

  const handlePaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    const newPaginationState = functionalUpdate(updaterOrValue, paginationState);
    onPaginationChange(newPaginationState);
  };

  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = (updaterOrValue) => {
    setColumnVisibility(updaterOrValue);
  };

  const handleResetResize = () => {
    const initialSizing = initializeColumnSizing(tableColumns, defaultColumn.size);
    setColumnSizing(initialSizing);
  };

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    columnResizeMode: 'onChange',
    state: {
      columnSizing,
      columnPinning,
      columnOrder,
      columnVisibility,
      rowSelection,
      sorting: sortingState,
      pagination: paginationState,
    },
    rowCount,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onRowSelectionChange: handleRowSelectionChange,
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,
    onColumnSizingChange: setColumnSizing,
    getRowId,
    defaultColumn,
  });

  const toolbarProps =
    filterOptions && onFiltersApply
      ? {
        table,
        filterOptions,
        handleFiltersApply: onFiltersApply,
        searchValue,
        onSearch,
        onExport,
        onResetResize: handleResetResize,
        initialColumnSize: initialSizing,
        additionalFilters,
        actionButton,
      }
      : {
        table,
        searchValue,
        onSearch,
        onExport,
        onResetResize: handleResetResize,
        initialColumnSize: initialSizing,
        additionalFilters,
        actionButton,
      };

  return (
    <Card className={cn('flex flex-1 flex-col overflow-hidden min-h-[450px]', className)}>
      <CardHeader>
        <TableToolbar {...toolbarProps} />
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
        <TableContent
          table={table}
          isLoading={isLoading}
          onRowClick={onRowClick}
          disableRowClick={disableRowClick}
          noRowsOverlay={noRowsOverlay}
        />
      </CardContent>
      <CardFooter className="flex items-center gap-2 justify-between p-4">
        <Pagination table={table} rowCount={rowCount} pageSizeOptions={pageSizeOptions} />
        {floatBarActionButtons && (
          <FloatBar
            table={table}
            renderActionButtons={(selectedRows, resetSelection) =>
              floatBarActionButtons.map((renderButton) =>
                renderButton(selectedRows, resetSelection),
              )
            }
          />
        )}
      </CardFooter>
    </Card>
  );
};

export {
  DataTable,
  type ExtendedColumnDef,
  type FiltersObj,
  type FilterValue,
  type PinningDirection,
};
