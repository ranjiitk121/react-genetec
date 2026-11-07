import type { Column } from '../features/data-grid/types';

export type PersonRow = {
    id: number;
    name: string;
    email: string;
    age: number;
    city: string;
    department: string;
    salary: number;
    active: boolean;
};

const FIRST_NAMES = [
    'Alice',
    'Bob',
    'Carol',
    'David',
    'Eve',
    'Frank',
    'Grace',
    'Heidi',
    'Ivan',
    'Judy',
];
const LAST_NAMES = [
    'Smith',
    'Jones',
    'Brown',
    'Taylor',
    'Wilson',
    'Davies',
    'Evans',
    'Thomas',
    'Roberts',
    'Walker',
];
const CITIES = ['Vienna', 'Berlin', 'London', 'Paris', 'Madrid', 'Rome', 'Oslo', 'Prague'];
const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Support', 'Finance', 'HR'];

// Deterministic pick: same index always yields the same value (stable renders + tests).
const pick = <T>(list: T[], i: number): T => list[i % list.length];

export function generateRows(count = 25): PersonRow[] {
    return Array.from({ length: count }, (_, i) => {
        const first = pick(FIRST_NAMES, i);
        const last = pick(LAST_NAMES, i * 7 + 3);
        return {
            id: i + 1,
            name: `${first} ${last}`,
            email: `${first}.${last}@example.com`.toLowerCase(),
            age: 22 + ((i * 13) % 40),
            city: pick(CITIES, i * 3),
            department: pick(DEPARTMENTS, i * 5),
            salary: 35000 + ((i * 2731) % 90000),
            active: i % 3 !== 0,
        };
    });
}

export const personColumns: Column<PersonRow>[] = [
    { id: 'id', label: 'ID', accessor: (r) => r.id, sortable: true },
    { id: 'name', label: 'Name', accessor: (r) => r.name, sortable: true },
    { id: 'email', label: 'Email', accessor: (r) => r.email },
    { id: 'age', label: 'Age', accessor: (r) => r.age, sortable: true },
    { id: 'city', label: 'City', accessor: (r) => r.city, sortable: true },
    { id: 'department', label: 'Department', accessor: (r) => r.department, sortable: true },
    {
        id: 'salary',
        label: 'Salary',
        accessor: (r) => r.salary,
        cell: (r) => `€${r.salary.toLocaleString('de-AT')}`,
        sortable: true,
    },
    {
        id: 'active',
        label: 'Status',
        accessor: (r) => (r.active ? 'Active' : 'Inactive'),
    },
];

/** Convenience: everything the DataGrid needs in one call. */
export function generateGridData(rowCount = 25) {
    return { columns: personColumns, rows: generateRows(rowCount) };
}
