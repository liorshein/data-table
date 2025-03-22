import { FiltersObj } from "@/components";
import { SortingState } from "@tanstack/react-table";

export type Person = {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    status: "active" | "inactive";
    department:
        | "engineering"
        | "marketing"
        | "sales"
        | "support"
        | "management";
    joinDate: Date;
};

const firstNames = [
    "John",
    "Jane",
    "Robert",
    "Emily",
    "Michael",
    "Sarah",
    "David",
    "Lisa",
    "Mark",
    "Jennifer",
    "Thomas",
    "Emma",
    "Daniel",
    "Olivia",
    "James",
    "Sophie",
    "William",
    "Ava",
    "Richard",
    "Mia",
];

const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Miller",
    "Davis",
    "Wilson",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
    "Thompson",
    "Garcia",
    "Martinez",
    "Robinson",
    "Clark",
];

const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateEmail = (firstName: string, lastName: string) => {
    const domains = [
        "example.com",
        "company.co",
        "acme.org",
        "mail.net",
        "business.io",
    ];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
};

const generatePersonData = (length: number): Person[] => {
    return Array.from({ length }, (_, i) => {
        const firstName =
            firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName =
            lastNames[Math.floor(Math.random() * lastNames.length)];
        const age = getRandomInt(22, 65);
        const status = Math.random() > 0.2 ? "active" : "inactive";
        const departments: Array<Person["department"]> = [
            "engineering",
            "marketing",
            "sales",
            "support",
            "management",
        ];
        const department =
            departments[Math.floor(Math.random() * departments.length)];

        // Generate join date (between 1-5 years ago)
        const today = new Date();
        const yearsAgo = getRandomInt(1, 5);
        const daysAgo = getRandomInt(0, 365);
        const joinDate = new Date(today);
        joinDate.setFullYear(today.getFullYear() - yearsAgo);
        joinDate.setDate(today.getDate() - daysAgo);

        return {
            id: `EMP-${(i + 1).toString().padStart(4, "0")}`,
            firstName,
            lastName,
            age,
            email: generateEmail(firstName, lastName),
            status,
            department,
            joinDate,
        };
    });
};

const INITIAL_DATA = generatePersonData(10000);

export const fetchPersonData = async (
    pageIndex: number,
    pageSize: number,
    sorting: SortingState,
    filters?: FiltersObj,
    search?: string
): Promise<{ data: Person[]; totalRows: number }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Fetching data with:", {
        pageIndex,
        pageSize,
        sorting,
        filters,
        search,
    });

    // Apply search if present
    let filteredData = [...INITIAL_DATA];
    if (search) {
        const searchLower = search.toLowerCase();
        filteredData = filteredData.filter((person) => {
            return (
                person.id.toLowerCase().includes(searchLower) ||
                person.firstName.toLowerCase().includes(searchLower) ||
                person.lastName.toLowerCase().includes(searchLower) ||
                person.email.toLowerCase().includes(searchLower) ||
                person.department.toLowerCase().includes(searchLower) ||
                person.status.toLowerCase().includes(searchLower) ||
                person.age.toString().includes(searchLower) ||
                person.joinDate
                    .toLocaleDateString()
                    .toLowerCase()
                    .includes(searchLower)
            );
        });
    }

    // Apply filters if present
    if (filters && Object.keys(filters).length > 0) {
        filteredData = filteredData.filter((person) => {
            return Object.entries(filters).every(([key, values]) => {
                // Skip if no values or empty array
                if (!values || (Array.isArray(values) && values.length === 0)) {
                    return true;
                }

                // Handle each field type appropriately
                switch (key) {
                    case "department":
                    case "status":
                        // For dropdown filters that return single string or array of strings
                        return Array.isArray(values)
                            ? values.includes(
                                  person[key as keyof Person] as string
                              )
                            : values === person[key as keyof Person];

                    case "age":
                        // For numeric filters
                        if (typeof values === "string") {
                            // If it's a range like "20-30"
                            if (values.includes("-")) {
                                const [min, max] = values
                                    .split("-")
                                    .map(Number);
                                return person.age >= min && person.age <= max;
                            }
                            // If it's a single value
                            return person.age === Number(values);
                        }
                        return true;

                    case "joinDate":
                        // For date filters
                        if (typeof values === "string") {
                            const filterDate = new Date(values);
                            const personDate = person.joinDate;
                            return (
                                personDate.toDateString() ===
                                filterDate.toDateString()
                            );
                        }
                        return true;

                    default:
                        // Default string comparison
                        return String(person[key as keyof Person])
                            .toLowerCase()
                            .includes(String(values).toLowerCase());
                }
            });
        });
    }

    // Apply sorting if present
    if (sorting.length > 0) {
        const { id, desc } = sorting[0];
        filteredData.sort((a, b) => {
            const aValue = a[id as keyof Person];
            const bValue = b[id as keyof Person];

            // Handle different data types for sorting
            if (aValue instanceof Date && bValue instanceof Date) {
                // Date sorting
                return desc
                    ? bValue.getTime() - aValue.getTime()
                    : aValue.getTime() - bValue.getTime();
            } else if (
                typeof aValue === "number" &&
                typeof bValue === "number"
            ) {
                // Number sorting
                return desc ? bValue - aValue : aValue - bValue;
            } else {
                // String sorting
                const aString = String(aValue).toLowerCase();
                const bString = String(bValue).toLowerCase();

                if (aString < bString) return desc ? 1 : -1;
                if (aString > bString) return desc ? -1 : 1;
                return 0;
            }
        });
    }

    // Calculate pagination slice
    const start = pageIndex * pageSize;
    const paginatedData = filteredData.slice(start, start + pageSize);

    return {
        data: paginatedData,
        totalRows: filteredData.length,
    };
};
