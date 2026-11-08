import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import type { Column, FilterState, SortState } from '../shared/types';
import { ColumnHeaderCell } from './column-header-cell';

type GridHeaderProps<TRow> = {
    columns: Column<TRow>[];
    sort: SortState;
    filters: FilterState;
    /** Column whose actions menu is currently open, or `null`. */
    activeActionsColumnId: string | null;
    onSort: (columnId: string) => void;
    onOpenMenu: (event: React.MouseEvent<HTMLButtonElement>, columnId: string) => void;
    onOpenFilter: (event: React.MouseEvent<HTMLButtonElement>, columnId: string) => void;
};

export function GridHeader<TRow>({
    columns,
    sort,
    filters,
    activeActionsColumnId,
    onSort,
    onOpenMenu,
    onOpenFilter,
}: GridHeaderProps<TRow>) {
    return (
        <TableHead>
            <TableRow>
                {columns.map((col) => (
                    <ColumnHeaderCell
                        key={col.id}
                        column={col}
                        sort={sort}
                        onSort={onSort}
                        onOpenMenu={onOpenMenu}
                        isMenuOpen={activeActionsColumnId === col.id}
                        hasFilter={(filters[col.id] ?? '').trim() !== ''}
                        onOpenFilter={onOpenFilter}
                    />
                ))}
            </TableRow>
        </TableHead>
    );
}
