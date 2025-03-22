import { ExtendedColumnDef, SortHeader } from "@/components";
import { Person } from "@/demo/mockData";

export const columns: ExtendedColumnDef<Person>[] = [
    {
        id: "id",
        accessorKey: "id",
        header: ({ column }) => {
            return <SortHeader column={column} title="ID" />;
        },
        size: 120,
    },
    {
        id: "firstName",
        accessorKey: "firstName",
        header: ({ column }) => {
            return <SortHeader column={column} title="First Name" />;
        },
    },
    {
        id: "lastName",
        accessorKey: "lastName",
        header: ({ column }) => {
            return <SortHeader column={column} title="Last Name" />;
        },
    },
    {
        id: "age",
        accessorKey: "age",
        header: ({ column }) => {
            return <SortHeader column={column} title="Age" />;
        },
        size: 80,
    },
    {
        id: "department",
        accessorKey: "department",
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
];