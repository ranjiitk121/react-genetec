import type { ReactNode } from 'react';

export type Column<TRow> = {
    id: string;
    label: string;
    accessor: (row: TRow) => string | number;
    cell?: (row: TRow) => ReactNode;
    sortable?: boolean;
    hidden?: boolean;
};

export type SortDirection = 'asc' | 'desc';
export type SortState = { columnId: string; direction: SortDirection } | null;

export type ColumnVisibility = Record<string, boolean>;
export type VisibilityState = Record<string, boolean>;
