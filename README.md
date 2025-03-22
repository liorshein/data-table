# React Advanced Data Table

A powerful, customizable data table component for React applications built on top of TanStack Table (React Table v8).

## Features

- **Comprehensive Functionality**
  - Server-side pagination
  - Column sorting with visual indicators
  - Advanced filtering system
  - Row selection with batch actions
  - Column resizing and visibility control
  - Column pinning (left/right)
  - Loading states and skeleton UI
  - CSV/JSON export

- **Highly Customizable**
  - Flexible styling with Tailwind CSS
  - Configurable UI components
  - Extensible through custom renderers
  - Controlled state management
  - Context-based architecture

- **Developer Experience**
  - TypeScript support for better type safety
  - Well-organized, modular code structure
  - Clear separation of concerns
  - Custom hooks for state management
  - Comprehensive documentation

## Installation

```bash
# Using npm
npm install react-advanced-data-table

# Using yarn
yarn add react-advanced-data-table

# Using pnpm
pnpm add react-advanced-data-table
```

## Quick Start

```tsx
import { useState } from 'react';
import { DataTable } from 'react-advanced-data-table';
import type { SortingState, PaginationState } from '@tanstack/react-table';

// Define your data type
type Person = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
};

// Sample data
const data: Person[] = [
  { id: '1', firstName: 'John', lastName: 'Doe', age: 30, email: 'john@example.com' },
  { id: '2', firstName: 'Jane', lastName: 'Smith', age: 25, email: 'jane@example.com' },
  // ...more data
];

// Define columns
const columns = [
  {
    id: 'firstName',
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    id: 'lastName',
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: 'Age',
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
  },
];

function App() {
  // Manage table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  
  return (
    <DataTable
      columns={columns}
      data={data}
      rowCount={data.length}
      sortingState={sorting}
      paginationState={pagination}
      onSortingChange={setSorting}
      onPaginationChange={setPagination}
      pageSizeOptions={[5, 10, 20, 50]}
    />
  );
}
```

## Advanced Usage

### Server-side Operations

For server-side operations, you can use the provided callbacks for pagination, sorting, and filtering:

```tsx
function ServerSideTable() {
  const [data, setData] = useState<Person[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await api.fetchData({
          page: pagination.pageIndex,
          pageSize: pagination.pageSize,
          sort: sorting,
        });
        
        setData(response.data);
        setRowCount(response.total);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [pagination, sorting]);

  return (
    <DataTable
      columns={columns}
      data={data}
      rowCount={rowCount}
      sortingState={sorting}
      paginationState={pagination}
      onSortingChange={setSorting}
      onPaginationChange={setPagination}
      isLoading={isLoading}
    />
  );
}
```

### Row Selection with Actions

```tsx
function TableWithRowActions() {
  // ... other state
  
  const handleBulkDelete = (selectedRows: Person[], resetSelection: () => void) => {
    // Delete selected rows
    resetSelection(); // Clear selection when done
  };
  
  return (
    <DataTable
      // ... other props
      floatBarActionButtons={[
        (selectedRows, resetSelection) => (
          <Button 
            key="delete" 
            variant="destructive" 
            onClick={() => handleBulkDelete(selectedRows, resetSelection)}
          >
            Delete Selected
          </Button>
        ),
        (selectedRows, resetSelection) => (
          <Button 
            key="approve" 
            onClick={() => handleApprove(selectedRows, resetSelection)}
          >
            Approve
          </Button>
        ),
      ]}
    />
  );
}
```

## Component Architecture

The data table is structured as follows:

```
datatable/
├── core/
│   ├── DataTable.tsx  # Main component
│   ├── types.ts       # Shared types
│   ├── context.tsx    # Context provider
│   └── utils.ts       # Table utilities
├── components/
│   ├── toolbar/       # Toolbar components
│   ├── table-content/ # Table content components
│   ├── pagination/    # Pagination component
│   └── float-bar/     # Floating action bar
├── hooks/             # Custom hooks
└── index.ts           # Public exports
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT