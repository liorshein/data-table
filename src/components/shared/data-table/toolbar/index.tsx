import { ColumnSizingState, Table } from '@tanstack/react-table';
import React from 'react';

import { Export } from '@/components/shared/data-table/toolbar/Export';
import { Filters } from '@/components/shared/data-table/toolbar/Filters';
import { SearchBar } from '@/components/shared/data-table/toolbar/SearchBar';
import { Settings } from '@/components/shared/data-table/toolbar/Settings';
import { FilterOption, FiltersObj } from '@/components/shared/filters-dropdown';
import { IconButton } from '@/components/shared/IconButton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ExportFileFormats } from '..';
import { IconColumnResize } from '@/icons';

type BaseTableToolbarProps<TData> = {
  /** The table instance from TanStack Table */
  table: Table<TData>;
  /** The initial column sizing state */
  initialColumnSize: ColumnSizingState;
  /** Current search value */
  searchValue?: string;
  /** Callback when search value changes, if doesn't exists - search field doesn't appear */
  onSearch?: (value: string) => void;
  /** Callback function triggered when export format is selected, if doesn't exists - export button doesn't appear */
  onExport?: (value: ExportFileFormats) => void;
  /** Callback function triggered when reset resize button is clicked */
  onResetResize: () => void;
  /** Optional additional filter components to render */
  additionalFilters?: React.ReactNode[];
  /** Optional action button to render on the right side */
  actionButton?: React.ReactNode;
};

type WithFiltersProps<TData> = BaseTableToolbarProps<TData> & {
  /** Array of filter options for the Filters component */
  filterOptions: FilterOption[];
  /** Callback function triggered when filters are applied
   * @param {FiltersObj} filters The current filter state
   */
  handleFiltersApply: (filters: FiltersObj) => void;
};

type WithoutFiltersProps<TData> = BaseTableToolbarProps<TData> & {
  filterOptions?: never;
  handleFiltersApply?: never;
};

type TableToolbarProps<TData> = WithFiltersProps<TData> | WithoutFiltersProps<TData>;

/**
 * A comprehensive toolbar component for tables that combines:
 * - Search functionality
 * - Filters with additional custom filters
 * - Column visibility controls
 * - Export options
 * - Custom action button
 * - Reset column resize button
 */
const TableToolbar = <TData,>({
  table,
  initialColumnSize,
  filterOptions = [],
  searchValue,
  handleFiltersApply,
  onSearch,
  onExport,
  onResetResize,
  additionalFilters,
  actionButton,
}: TableToolbarProps<TData>) => {
  const hasColumnResizing = () => {
    const currentSizing = table.getState().columnSizing;
    const keys = Object.keys(currentSizing);

    if (keys.length === 0) return false;

    return keys.some((key) => currentSizing[key] !== initialColumnSize[key]);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col xl:flex-row justify-center xl:items-center items-start gap-2">
        {searchValue !== undefined && onSearch && <SearchBar searchValue={searchValue} onSearch={onSearch} />}
        {filterOptions.length > 0 && handleFiltersApply && (
          <Filters
            filterOptions={filterOptions}
            handleFiltersApply={handleFiltersApply}
            additionalFilters={additionalFilters}
          />
        )}
        <p className="text-muted-foreground text-sm">{`${table.getRowCount()} found`}</p>
      </div>
      <div className="flex items-center gap-2">
        {hasColumnResizing() && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  icon={<IconColumnResize className="size-6" />}
                  variant="secondary"
                  onClick={onResetResize}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-secondary text-secondary-foreground">
                Resize Columns
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <Settings table={table} />
        {onExport && <Export onExport={onExport} />}
        {actionButton}
      </div>
    </div>
  );
};

export { TableToolbar };
