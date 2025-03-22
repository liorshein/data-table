import { FaSort, FaSearch, FaFilter, FaDownload, FaArrowRight } from "react-icons/fa"
import FeatureCard from "./FeatureCard"

const Docs = () => {
    return <div className="space-y-12">
        <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Data Table Features</h2>
            <p className="text-lg text-gray-600">
                Our DataTable component is built with React and TanStack Table, offering a complete solution for displaying, filtering, and interacting with tabular data.
            </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
                icon={<FaSort className="w-5 h-5" />}
                title="Column Sorting"
                description="Click on column headers to sort data in ascending or descending order. The sort state is preserved in URL parameters for easy sharing and bookmarking."
            />
            <FeatureCard
                icon={<FaSearch className="w-5 h-5" />}
                title="Global Search"
                description="Quickly find information with the global search feature. The search query is debounced to prevent excessive API calls during typing."
            />
            <FeatureCard
                icon={<FaFilter className="w-5 h-5" />}
                title="Advanced Filtering"
                description="Filter data by multiple criteria simultaneously. Filters are organized by groups and can be combined to narrow down results precisely."
            />
            <FeatureCard
                icon={<div className="flex">1 2 3</div>}
                title="Pagination"
                description="Navigate through large datasets with ease. Adjust page size to control how many records are displayed at once."
            />
            <FeatureCard
                icon={<FaDownload className="w-5 h-5" />}
                title="Data Export"
                description="Export the current view to CSV or Excel format for offline analysis or reporting purposes."
            />
            <FeatureCard
                icon={<FaArrowRight className="w-5 h-5" />}
                title="URL State Persistence"
                description="All table states (sorting, pagination, filters, search) are preserved in URL parameters, enabling shareable links that maintain the exact same view."
            />
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-medium text-gray-800 mb-2">Implementation Details</h3>
                <p className="text-gray-600">
                    The DataTable component integrates with backend APIs via customizable fetch functions. This example uses a mock data service that simulates server-side filtering and pagination.
                </p>
            </div>
            <div className="p-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Key Technical Features:</h4>
                <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span><strong>Server-side operations:</strong> Sorting, filtering, and pagination are handled on the server to optimize performance with large datasets.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span><strong>Debounced search:</strong> Search queries are debounced to reduce API calls and improve responsiveness.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span><strong>URL state management:</strong> Table state is synchronized with URL parameters for bookmarkable and shareable views.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span><strong>Customizable columns:</strong> Each column can be configured with custom rendering, sorting behavior, and sizing.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span><strong>Loading states:</strong> Visual indicators show when data is being fetched to improve user experience.</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
}

export default Docs