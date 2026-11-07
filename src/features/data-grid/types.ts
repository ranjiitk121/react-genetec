import type { ReactNode } from 'react';

export type Column<TRow> = {
    id: string;
    label: string;
    accessor: (row: TRow) => string | number;
    cell?: (row: TRow) => ReactNode;
    sortable?: boolean;
    hidden?: boolean;
};
