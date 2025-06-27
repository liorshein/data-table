import { FilterOption } from "@/components";
import { DropdownFilters } from "@/components/shared/data-table/toolbar/filters";

const filterOptions: FilterOption[] = [
  {
    key: "status",
    group: "Status",
    label: "Active",
    value: "active",
    type: "checkbox",
  },
  {
    key: "status",
    group: "Status",
    label: "Inactive",
    value: "inactive",
    type: "checkbox",
  },
  {
    key: "department",
    group: "Department",
    label: "Engineering",
    value: "engineering",
    type: "checkbox",
  },
  {
    key: "department",
    group: "Department",
    label: "Marketing",
    value: "marketing",
    type: "checkbox",
  },
  {
    key: "department",
    group: "Department",
    label: "Sales",
    value: "sales",
    type: "checkbox",
  },
  {
    key: "department",
    group: "Department",
    label: "Support",
    value: "support",
    type: "checkbox",
  },
  {
    key: "department",
    group: "Department",
    label: "Management",
    value: "management",
    type: "checkbox",
  },
];

const Filters = () => {
  const groupedOptions: Record<string, FilterOption[]> = {};

  filterOptions.forEach((option) => {
    if (!groupedOptions[option.group]) {
      groupedOptions[option.group] = [];
    }
    groupedOptions[option.group].push(option);
  });

  const standardFilterGroups = Object.entries(groupedOptions).map(([groupName, options]) => ({
    key: options[0]?.key || groupName.toLowerCase(),
    name: groupName,
    options,
  }));

  return <DropdownFilters filterGroups={standardFilterGroups} />;
};

export { Filters }