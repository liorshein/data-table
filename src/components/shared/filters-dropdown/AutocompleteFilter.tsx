import { useEffect, useState } from 'react';

import { AutoComplete } from '@/components/shared/Autocomplete';
import { FilterComponentProps } from '@/components/shared/filters-dropdown';

const AutocompleteFilter = ({ option, groupKey, value, onChange }: FilterComponentProps) => {
  const currentValue = value[groupKey] || '';
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (value[groupKey] === undefined || value[groupKey] === '') {
      setSearchValue('');
    }
  }, [value, groupKey]);

  // If autocomplete options aren't provided, create them from the option itself
  const autocompleteOptions = option.options || [{ label: option.label, value: option.value }];

  // Find the selected option's label
  const selectedOption = autocompleteOptions.find((opt) =>
    typeof currentValue === 'string' ? opt.value === currentValue : false,
  );

  // Handle selection change
  const handleSelectionChange = (selectedValue: string) => {
    onChange(groupKey, selectedValue);
  };

  // Handle search value change - support for deletion
  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);

    // When the search field becomes empty and there was a previous selection, clear the filter
    if (value === '' && currentValue) {
      onChange(groupKey, '');
    }
  };

  // Stop propagation to prevent dropdown closing on interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="p-1 w-full" onMouseDown={handleMouseDown} onClick={(e) => e.stopPropagation()}>
      <AutoComplete
        selectedValue={typeof currentValue === 'string' ? currentValue : null}
        onSelectedValueChange={handleSelectionChange}
        searchValue={selectedOption?.label || searchValue}
        onSearchValueChange={handleSearchValueChange}
        items={autocompleteOptions}
        placeholder={`Search ${option.group}...`}
        emptyMessage={`No ${option.group.toLowerCase()} found`}
      />
    </div>
  );
};

export { AutocompleteFilter };
