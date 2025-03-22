import { ExtendedColumnDef } from '@/components/shared/data-table';
import { Checkbox } from '@/components/ui/checkbox';

const createCheckboxColumn = <TData,>(): ExtendedColumnDef<TData> => ({
  id: 'select',
  header: ({ table }) => (
    <div className="flex items-center justify-end h-4" data-cell-checkbox>
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        disabled={table.getRowModel().rows.length === 0}
      />
    </div>
  ),
  cell: ({ row }) => (
    <div className="flex items-center justify-end h-4" data-cell-checkbox>
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    </div>
  ),
  enableSorting: false,
  enableHiding: false,
  enableResizing: false,
  size: 50,
  minSize: 50,
  pinned: 'left',
});

export { createCheckboxColumn };
