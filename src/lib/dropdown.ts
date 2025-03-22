type DropdownOption = {
  /** Text label shown in the dropdown */
  label: string;
  /** Unique value for the option */
  value: string;
  /** Optional click handler for the option */
  onClick?: () => void;
  /** Optional group name for categorizing options */
  group?: string;
  /** Optional icon element to display before the label */
  icon?: React.ReactNode;
};

type DropdownVariant = 'default' | 'secondary' | 'link' | 'destructive' | 'ghost' | null;

const getGroupOptions = (options: DropdownOption[]) => {
  return options.reduce(
    (acc, option) => {
      if (option.group) {
        if (!acc[option.group]) {
          acc[option.group] = [];
        }
        acc[option.group].push(option);
      }
      return acc;
    },
    {} as Record<string, DropdownOption[]>,
  );
};

const getUngroupedOptions = (options: DropdownOption[]) => {
  return options.filter((option) => !option.group);
};

export { type DropdownOption, type DropdownVariant, getGroupOptions, getUngroupedOptions };
