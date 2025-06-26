import {
  ColumnPinningState,
  ColumnSizingState,
  functionalUpdate,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import { ExtendedColumnDef } from '@/components/shared/data-table/types';
import { initializeColumnSizing, setupColumnPinningAndOrder } from '@/lib/dataTable';

type UseDataTableStateProps<TData> = {
  columns: ExtendedColumnDef<TData>[];
  defaultColumnSize?: number;
  visibilityState?: VisibilityState;
  sortingState: SortingState;
  paginationState: PaginationState;
  onSortingChange: (sorting: SortingState) => void;
  onPaginationChange: (pagination: PaginationState) => void;
  disableRowSelection?: boolean;
  createCheckboxColumn?: () => ExtendedColumnDef<TData>;
};

export const useDataTableState = <TData>({
  columns,
  defaultColumnSize = 200,
  visibilityState = {},
  sortingState,
  paginationState,
  onSortingChange,
  onPaginationChange,
  disableRowSelection = false,
  createCheckboxColumn,
}: UseDataTableStateProps<TData>) => {
  // Memoize table columns with checkbox column if needed
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

    const checkboxColumn = createCheckboxColumn ? createCheckboxColumn() : null;
    return checkboxColumn ? [checkboxColumn, ...columns, placeholderColumn] : [...columns, placeholderColumn];
  }, [columns, disableRowSelection, createCheckboxColumn]);

  // Initialize column sizing
  const initialSizing = useMemo(
    () => initializeColumnSizing(tableColumns, defaultColumnSize),
    [defaultColumnSize, tableColumns],
  );

  // Initialize column pinning and order
  const { initialPinning, columnOrder } = useMemo(
    () => setupColumnPinningAndOrder(tableColumns),
    [tableColumns],
  );

  // Local state management
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(initialSizing);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(visibilityState);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnPinning] = useState<ColumnPinningState>(initialPinning);

  // Event handlers
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
    const newInitialSizing = initializeColumnSizing(tableColumns, defaultColumnSize);
    setColumnSizing(newInitialSizing);
  };

  return {
    // Computed values
    tableColumns,
    initialSizing,
    columnOrder,
    
    // State
    columnSizing,
    columnVisibility,
    rowSelection,
    columnPinning,
    
    // State setters
    setColumnSizing,
    
    // Event handlers
    handleRowSelectionChange,
    handleSortingChange,
    handlePaginationChange,
    handleColumnVisibilityChange,
    handleResetResize,
  };
};