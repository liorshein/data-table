import { DataTable, FiltersObj } from "@/components";
import { useDebounce } from "@/hooks/useDebounce";
import { useQueryParams } from "@/hooks/useUrlParams";
import { SortingState, PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { fetchPersonData, Person } from "./mockData";
import { columns } from "./columns";
import { filterOptions } from "./filters";

const EmployeesTableDemo = () => {
    const [data, setData] = useState<Person[]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [queryStates, setQueryStates] = useQueryParams();
    const { pageIndex, pageSize, sort, filters, search } = queryStates;

    const debouncedSearch = useDebounce(search, 1000);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { data: fetchedData, totalRows } = await fetchPersonData(
                    pageIndex,
                    pageSize,
                    sort,
                    filters,
                    debouncedSearch
                );

                setData(fetchedData);
                setRowCount(totalRows);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [filters, pageIndex, pageSize, sort, debouncedSearch]);

    const handleSortingChange = (newSorting: SortingState) => {
        setQueryStates({ sort: newSorting });
    };

    const handlePaginationChange = (updatedPagination: PaginationState) => {
        setQueryStates({
            pageIndex: updatedPagination.pageIndex,
            pageSize: updatedPagination.pageSize,
        });
    };

    const handleFiltersApply = (filters: FiltersObj) => {
        setQueryStates((prev) => {
            const newFilters = {
                ...prev.filters,
                ...filters,
            };

            Object.keys(newFilters).forEach((key) => {
                if (newFilters[key] === undefined) {
                    delete newFilters[key];
                }
            });

            return { filters: newFilters };
        });
    };

    const handleSearch = (value: string) => {
        if (value !== search) setQueryStates({ search: value });
    };

    return (
        <div className="space-y-6">
            <DataTable
                columns={columns}
                data={data}
                rowCount={rowCount}
                sortingState={sort}
                paginationState={{ pageIndex, pageSize }}
                onSortingChange={handleSortingChange}
                onPaginationChange={handlePaginationChange}
                pageSizeOptions={[10, 20, 50, 100]}
                isLoading={isLoading}
                searchValue={search}
                onSearch={handleSearch}
                filterOptions={filterOptions}
                onFiltersApply={handleFiltersApply}
                onExport={(format) => {
                    alert(`Exporting data as ${format}. In a real app, this would download the data.`);
                }}
            />

            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Using the DataTable</h3>
                    <p className="text-gray-600 mb-4">
                        Here's how to interact with the features demonstrated above:
                    </p>
                    <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">1.</span>
                            <span><strong>Sorting:</strong> Click any column header to sort by that column. Click again to reverse the sort order.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">2.</span>
                            <span><strong>Searching:</strong> Use the search box to find matching records across all searchable fields.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">3.</span>
                            <span><strong>Filtering:</strong> Click the filter button to open the filter panel. Select multiple criteria to narrow down results.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">4.</span>
                            <span><strong>Pagination:</strong> Navigate between pages using the pagination controls at the bottom of the table.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">5.</span>
                            <span><strong>Exporting:</strong> Click the export button to download the current data view in your preferred format.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export { EmployeesTableDemo }