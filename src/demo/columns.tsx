import { ExtendedColumnDef, SortHeader, TableActions, TableAction } from "@/components";
import { Eye, Edit, Trash2, Copy } from "lucide-react";
import { Person } from "@/demo/mockData";

export const columns: ExtendedColumnDef<Person>[] = [
    {
        id: "id",
        accessorKey: "id",
        displayLabel: 'ID',
        header: ({ column }) => {
            return <SortHeader column={column} title="ID" />;
        },
        size: 120,
    },
    {
        id: "firstName",
        accessorKey: "firstName",
        displayLabel: 'First Name',
        header: ({ column }) => {
            return <SortHeader column={column} title="First Name" />;
        },
    },
    {
        id: "lastName",
        accessorKey: "lastName",
        displayLabel: 'Last Name',
        header: ({ column }) => {
            return <SortHeader column={column} title="Last Name" />;
        },
    },
    {
        id: "age",
        accessorKey: "age",
        displayLabel: 'Age',
        header: ({ column }) => {
            return <SortHeader column={column} title="Age" />;
        },
        size: 80,
    },
    {
        id: "department",
        accessorKey: "department",
        displayLabel: 'Department',
        header: ({ column }) => {
            return <SortHeader column={column} title="Department" />;
        },
        cell: (info) => {
            const value = info.getValue() as string;
            return (
                <span className="font-medium">
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
            );
        },
    },
    {
        id: "status",
        accessorKey: "status",
        displayLabel: 'Status',
        header: ({ column }) => {
            return <SortHeader column={column} title="Status" />;
        },
        cell: (info) => {
            const status = info.getValue() as "active" | "inactive";
            return (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === "active"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-rose-100 text-rose-800 border border-rose-200"
                        }`}
                >
                    {status === "active" ? "Active" : "Inactive"}
                </span>
            );
        },
        size: 100,
    },
    {
        id: "email",
        accessorKey: "email",
        displayLabel: 'Email',
        header: ({ column }) => {
            return <SortHeader column={column} title="Email" />;
        },
        cell: (info) => (
            <a
                href={`mailto:${info.getValue()}`}
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
                {info.getValue() as string}
            </a>
        ),
        size: 220,
    },
    {
        id: "joinDate",
        accessorKey: "joinDate",
        displayLabel: 'Join Date',
        header: ({ column }) => {
            return <SortHeader column={column} title="Join Date" />;
        },
        cell: (info) => {
            const date = info.getValue() as Date;
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            return <span className="font-medium">{formattedDate}</span>;
        },
        size: 120,
        sortingFn: "datetime"
    },
    {
        id: "actions",
        displayLabel: 'Actions',
        header: "Actions",
        cell: ({ row }) => {
            const person = row.original;

            const actions: TableAction<Person>[] = [
                {
                    label: "View Details",
                    icon: <Eye className="h-4 w-4" />,
                    onClick: (person) => {
                        console.log("View person:", person);
                        alert(`Viewing details for ${person.firstName} ${person.lastName}`);
                    }
                },
                {
                    label: "Edit",
                    icon: <Edit className="h-4 w-4" />,
                    onClick: (person) => {
                        console.log("Edit person:", person);
                        alert(`Editing ${person.firstName} ${person.lastName}`);
                    }
                },
                {
                    label: "Copy Info",
                    icon: <Copy className="h-4 w-4" />,
                    onClick: (person) => {
                        const personData = `${person.firstName} ${person.lastName} (${person.email})`;
                        navigator.clipboard.writeText(personData);
                        alert(`Copied: ${personData}`);
                    },
                    separatorAfter: true
                },
                {
                    label: "Delete",
                    icon: <Trash2 className="h-4 w-4" />,
                    onClick: (person) => {
                        console.log("Delete person:", person);
                        if (window.confirm(`Are you sure you want to delete ${person.firstName} ${person.lastName}?`)) {
                            alert(`Deleted ${person.firstName} ${person.lastName}`);
                        }
                    },
                    variant: "destructive"
                }
            ];

            return <TableActions data={person} actions={actions} />;
        },
        enableSorting: false,
        enableHiding: false,
        size: 80,
        pinned: 'right',
    },
];