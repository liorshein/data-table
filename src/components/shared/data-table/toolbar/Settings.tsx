import { Table } from '@tanstack/react-table';

import { ColumnVisibility } from '@/components/shared/data-table/toolbar/ColumnVisibility';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Columns3, Settings2 } from 'lucide-react';

type SettingsProps<TData> = {
  table: Table<TData>;
};

const Settings = <TData,>({ table }: SettingsProps<TData>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <div className="flex justify-center items-center gap-2">
            <Settings2 className="size-6" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Columns3 /> Columns
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="max-h-64 overflow-y-auto">
              <ColumnVisibility table={table} />
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { Settings };
