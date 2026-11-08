import type { Column, ColumnVisibility, FilterState, SortState } from './types';

export function getSortedRows<TRow>(
    rows: TRow[],
    columns: Column<TRow>[],
    sort: SortState,
): TRow[] {
    if (!sort) {
        return rows;
    }

    // Resolve the sort column ONCE — not inside the comparator, which runs ~n·log n
    // times (~20M for 1M rows). Re-finding it per comparison is what froze the tab.
    // Throw Error when columnToSortBy.
    const columnToSortBy = columns.find((col) => col.id === sort.columnId);
    if (!columnToSortBy) return rows;

    // Decorate-sort-undecorate: compute each row's sort key ONCE (O(n) accessor calls)
    // instead of 2× per comparison (O(n·log n)). The comparator then only compares
    // precomputed primitives.
    // NOTE: single-column only. Multi-column sort is unsupported by design — see NOTES.md.
    const dir = sort.direction === 'asc' ? 1 : -1;
    const decorated = rows.map((row) => ({ row, key: columnToSortBy.accessor(row) }));
    decorated.sort((a, b) => {
        if (a.key < b.key) return -dir;
        if (a.key > b.key) return dir;
        return 0;
    });
    return decorated.map((d) => d.row);
}

/**
 * Single source of truth for "is this column visible right now", working from
 * the sparse override map + the column's own `hidden` default. Both the reducer
 * (when toggling) and the render pass (when filtering columns) call this, so the
 * two can never disagree on what the default is.
 */
export const resolveVisibility = (
    visibility: ColumnVisibility,
    columnId: string,
    hidden?: boolean,
): boolean => visibility[columnId] ?? !hidden;

export const isColumnVisible = <TRow>(col: Column<TRow>, visibility: ColumnVisibility): boolean =>
    resolveVisibility(visibility, col.id, col.hidden);

export const getVisibleColumns = <TRow>(
    columns: Column<TRow>[],
    visibility: ColumnVisibility,
): Column<TRow>[] => columns.filter((col) => isColumnVisible(col, visibility));

/** Slice out the rows for the current page. */
export const paginate = <TRow>(rows: TRow[], page: number, rowsPerPage: number): TRow[] =>
    rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

export const hasActiveFilters = (filters: FilterState): boolean =>
    Object.values(filters).some((value) => (value ?? '').trim() !== '');

function rowMatchesFilters<TRow>(
    row: TRow,
    columns: Column<TRow>[],
    filters: FilterState,
): boolean {
    return columns.every((column) => {
        const text = (filters[column.id] ?? '').trim().toLowerCase();
        if (text === '') return true;
        return String(column.accessor(row)).toLowerCase().includes(text);
    });
}

export function getFilteredRows<TRow>(
    rows: TRow[],
    columns: Column<TRow>[],
    filters: FilterState,
): TRow[] {
    const hasActiveFilter = columns.some((column) => (filters[column.id] ?? '').trim() !== '');
    if (!hasActiveFilter) return rows;
    return rows.filter((row) => rowMatchesFilters(row, columns, filters));
}
