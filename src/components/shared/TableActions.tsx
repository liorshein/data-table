import { MoreHorizontal } from "lucide-react";
import { ReactNode } from "react";

import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components";

export type TableAction<TData> = {
    label: string;
    icon?: ReactNode;
    onClick: (data: TData) => void;
    variant?: 'default' | 'destructive';
    separatorAfter?: boolean;
};

type TableActionsProps<TData> = {
    data: TData;
    actions: TableAction<TData>[];
    triggerClassName?: string;
};

/**
 * Reusable TableActions component that can be used in any table column
 * 
 * @example
 * ```tsx
 * <TableActions
 *   data={person}
 *   actions={[
 *     {
 *       label: "View Details",
 *       icon: <Eye className="h-4 w-4" />,
 *       onClick: (person) => console.log("View", person)
 *     },
 *     {
 *       label: "Delete",
 *       icon: <Trash2 className="h-4 w-4" />,
 *       onClick: (person) => console.log("Delete", person),
 *       variant: "destructive",
 *       separatorAfter: true
 *     }
 *   ]}
 * />
 * ```
 */
export const TableActions = <TData,>({ 
    data, 
    actions, 
    triggerClassName = "h-8 w-8 p-0" 
}: TableActionsProps<TData>) => {
    return (
        <div className="flex items-center justify-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className={triggerClassName}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    {actions.map((action, index) => (
                        <div key={index}>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(data);
                                }}
                                className={`cursor-pointer ${
                                    action.variant === 'destructive' 
                                        ? 'text-red-600 focus:text-red-600' 
                                        : ''
                                }`}
                            >
                                {action.icon && (
                                    <span className="mr-2">
                                        {action.icon}
                                    </span>
                                )}
                                {action.label}
                            </DropdownMenuItem>
                            {action.separatorAfter && <DropdownMenuSeparator />}
                        </div>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};