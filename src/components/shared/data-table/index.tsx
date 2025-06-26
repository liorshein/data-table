import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';

import { FloatBar } from '@/components/shared/data-table/FloatBar';
import { Pagination } from '@/components/shared/data-table/Pagination';
import { TableContent } from '@/components/shared/data-table/table-content';
import { createCheckboxColumn } from '@/components/shared/data-table/table-content/components/Columns';
import { TableToolbar } from '@/components/shared/data-table/toolbar';
import {
  DataTableProps,
  ExtendedColumnDef,
  ExportFileFormats,
  PinningDirection,
} from '@/components/shared/data-table/types';
import { FiltersObj, FilterValue } from '@/components/shared/filters-dropdown';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useDataTableState } from '@/hooks/useDataTableState';
import { cn } from '@/lib/utils';


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
const DataTable = <TData,>(props: DataTableProps<TData>) => {
  const {
    // Config
    columns,
    data,
    defaultColumn = DEFAULT_COLUMN,
    rowCount,
    getRowId,
    
    // State
    sortingState,
    paginationState,
    visibilityState = {},
    searchValue,
    
    // Callbacks
    onSortingChange,
    onPaginationChange,
    onFiltersApply,
    onRowClick,
    onSearch,
    onExport,
    
    // Features
    disableRowSelection = false,
    disableRowClick = false,
    isLoading,
    pageSizeOptions,
    filterOptions,
    
    // Customization
    className,
    additionalFilters,
    actionButton,
    noRowsOverlay,
    floatBarActionButtons,
  } = props;

  // Use our custom hook to manage table state
  const {
    tableColumns,
    initialSizing,
    columnOrder,
    columnSizing,
    columnVisibility,
    rowSelection,
    columnPinning,
    setColumnSizing,
    handleRowSelectionChange,
    handleSortingChange,
    handlePaginationChange,
    handleColumnVisibilityChange,
    handleResetResize,
  } = useDataTableState({
    columns,
    defaultColumnSize: defaultColumn.size,
    visibilityState,
    sortingState,
    paginationState,
    onSortingChange,
    onPaginationChange,
    disableRowSelection,
    createCheckboxColumn: () => createCheckboxColumn<TData>(),
  });

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

  // Memoize toolbar props to prevent unnecessary re-renders
  const toolbarProps = useMemo(() => {
    const baseProps = {
      table,
      searchValue,
      onSearch,
      onExport,
      onResetResize: handleResetResize,
      initialColumnSize: initialSizing,
      additionalFilters,
      actionButton,
    };

    if (filterOptions && onFiltersApply) {
      return {
        ...baseProps,
        filterOptions,
        handleFiltersApply: onFiltersApply,
      };
    }

    return baseProps;
  }, [
    table,
    searchValue,
    onSearch,
    onExport,
    handleResetResize,
    initialSizing,
    additionalFilters,
    actionButton,
    filterOptions,
    onFiltersApply,
  ]);

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
  type DataTableProps,
  type ExtendedColumnDef,
  type ExportFileFormats,
  type FiltersObj,
  type FilterValue,
  type PinningDirection,
};
