import { ColumnPinningState, ColumnSizingState, VisibilityState } from '@tanstack/react-table';

import { ExtendedColumnDef, PinningDirection } from '@/components';

const DEFAULT_COLUMN_WIDTH = 200;

type StyleProps = {
  isPinned?: PinningDirection;
  direction?: 'left' | 'right';
  width?: number;
  minWidth?: number;
  offset: number;
  isHeader?: boolean;
};

export const calculatePinnedOffset = (
  columnId: string,
  direction: 'left' | 'right',
  columnPinning: ColumnPinningState,
  columnSizing: ColumnSizingState,
  defaultWidth?: number,
): number => {
  const pinnedColumns = columnPinning[direction] || [];
  const columnIndex = pinnedColumns.indexOf(columnId);
  if (columnIndex === -1) return 0;

  return pinnedColumns
    .slice(0, columnIndex)
    .reduce((acc, id) => acc + (columnSizing[id] || defaultWidth || DEFAULT_COLUMN_WIDTH), 0);
};

export const createStyles = ({
  isPinned,
  direction,
  width,
  minWidth,
  offset,
  isHeader,
}: StyleProps): React.CSSProperties => {
  const style: React.CSSProperties = {
    width,
    minWidth: minWidth ?? width,
    maxWidth: width,
  };

  if (isPinned) {
    style.position = 'sticky';
    style[direction || 'left'] = offset;
    style.zIndex = isHeader ? 40 : 10;
    style.backgroundColor = 'inherit';

    if (isHeader) {
      style.borderBottom = '1px solid var(--color-border)';
    }

    if (direction === 'right') {
      style.boxShadow = '4px 0 4px -4px var(--color-border) inset';
    }
  }

  return style;
};

const validateColumnId = (id: unknown): string => {
  if (typeof id !== 'string' || !id.trim()) {
    throw new Error(`Column ID must be a non-empty string, received: ${typeof id}`);
  }
  return id;
};

const initializeColumnSizing = <TData>(
  columns: ExtendedColumnDef<TData>[],
  defaultWidth?: number,
): ColumnSizingState => {
  const sizing: ColumnSizingState = {};
  columns.forEach((col) => {
    const columnId = validateColumnId(col.id);
    sizing[columnId] = col.size || defaultWidth || DEFAULT_COLUMN_WIDTH;
  });
  return sizing;
};

const setupColumnPinningAndOrder = <TData>(columns: ExtendedColumnDef<TData>[]) => {
  const pinning: { left: string[]; right: string[] } = { left: [], right: [] };
  const unpinned: string[] = [];

  columns.forEach((col) => {
    const id = validateColumnId(col.id);
    if (col.pinned === 'right') {
      pinning.right.push(id);
    } else if (col.pinned === 'left' || col.pinned === true) {
      pinning.left.push(id);
    } else {
      unpinned.push(id);
    }
  });

  return {
    initialPinning: pinning,
    columnOrder: [...pinning.left, ...unpinned, ...pinning.right],
  };
};

const removeActiveRowClassname = () => {
  document.querySelectorAll('.selected-row').forEach((element) => {
    element.classList.remove('selected-row');
  });
};

const createColumnVisibility = <TData>(
  columns: ExtendedColumnDef<TData>[],
  hiddenColumns: string[] = [],
): VisibilityState => {
  const visibility = columns.reduce((acc, column) => {
    acc[column.id as string] = true;
    return acc;
  }, {} as VisibilityState);

  hiddenColumns.forEach((columnKey) => {
    if (columnKey in visibility) {
      visibility[columnKey] = false;
    }
  });

  return visibility;
};

export {
  createColumnVisibility,
  initializeColumnSizing,
  removeActiveRowClassname,
  setupColumnPinningAndOrder,
  validateColumnId,
};
