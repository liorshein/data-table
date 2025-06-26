import { Row, SortingState, PaginationState, VisibilityState, ColumnDef } from '@tanstack/react-table';
import React from 'react';

import { FilterOption, FiltersObj } from '@/components/shared/filters-dropdown';

export type ExportFileFormats = 'csv' | 'json';
export type PinningDirection = boolean | 'left' | 'right';

export type ExtendedColumnDef<TData> = ColumnDef<TData, unknown> & {
  /** Optional pinning direction for the column */
  pinned?: PinningDirection;
  displayLabel?: string;
};

// Grouped parameter interfaces
export type DataTableConfig<TData> = {
  /** Array of column definitions */
  columns: ExtendedColumnDef<TData>[];
  /** Array of data items to display in the data table */
  data: TData[];
  /** Total number of rows (used for server-side pagination) */
  rowCount: number;
  /** Default column configuration */
  defaultColumn?: Partial<ColumnDef<TData, unknown>>;
  /** Function to get unique row identifier */
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
};

export type DataTableState = {
  /** Current sorting state */
  sortingState: SortingState;
  /** Current pagination state */
  paginationState: PaginationState;
  /** Current column visibility state */
  visibilityState?: VisibilityState;
  /** Current search value */
  searchValue?: string;
};

export type DataTableCallbacks<TData> = {
  /** Callback when sorting changes */
  onSortingChange: (sorting: SortingState) => void;
  /** Callback when pagination changes */
  onPaginationChange: (pagination: PaginationState) => void;
  /** Callback when filters are applied */
  onFiltersApply?: (filters: FiltersObj) => void;
  /** Callback when a row is clicked */
  onRowClick?: (rowData: TData) => void;
  /** Callback when search value changes, if doesn't exists - search field doesn't appear */
  onSearch?: (value: string) => void;
  /** Callback when export is triggered, if doesn't exists - export button doesn't appear */
  onExport?: (value: ExportFileFormats) => void;
};

export type DataTableFeatures = {
  /** Flag to disable row selection functionality */
  disableRowSelection?: boolean;
  /** Flag to disable row click interactions */
  disableRowClick?: boolean;
  /** Flag to show loading state */
  isLoading?: boolean;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Array of filter options */
  filterOptions?: FilterOption[];
};

export type DataTableCustomization<TData> = {
  /** Optional card className */
  className?: string;
  /** Optional additional filter components */
  additionalFilters?: React.ReactNode[];
  /** Optional action button component */
  actionButton?: React.ReactNode;
  /** Optional empty state overlay */
  noRowsOverlay?: React.ReactNode;
  /** Action button render functions that receive selected rows data */
  floatBarActionButtons?: ((
    selectedRows: TData[],
    resetSelection: () => void,
  ) => React.ReactNode)[];
};

export type DataTableProps<TData> = DataTableConfig<TData> & 
  DataTableState & 
  DataTableCallbacks<TData> & 
  DataTableFeatures & 
  DataTableCustomization<TData>;