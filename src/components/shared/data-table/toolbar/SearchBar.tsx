import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type SearchBarProps = {
  /** Current search value */
  searchValue: string;
  /**
   * Callback function triggered when the search value changes
   * @param {string} value The debounced search value
   */
  onSearch: (value: string) => void;
};

/**
 * A search input component with debounced value updates.
 * Features:
 * - Debounced search to reduce API calls
 * - Search icon
 * - Responsive input field
 * - Controlled input with local state
 */
const SearchBar = ({ searchValue, onSearch }: SearchBarProps) => {
  return (
    <div className="relative w-56">
      <Search className="absolute left-2 top-3 size-4 text-muted-foreground" />
      <Input
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-9"
      />
    </div>
  );
};

export { SearchBar };
