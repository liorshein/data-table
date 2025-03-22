import { FilterComponentProps } from '@/components/shared/filters-dropdown';
import { DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';

const CheckboxFilter = ({ option, groupKey, onChange, isSelected }: FilterComponentProps) => {
  return (
    <DropdownMenuCheckboxItem
      key={option.value}
      onCheckedChange={() => onChange(groupKey, option.value)}
      checked={isSelected}
      onSelect={(event) => event.preventDefault()}
    >
      {option.label}
    </DropdownMenuCheckboxItem>
  );
};

export { CheckboxFilter };
