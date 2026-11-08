import type { Column, ColumnVisibility, FilterState, SortState } from './types';

export function getSortedRows<TRow>(
    rows: TRow[],
    columns: Column<TRow>[],
    sort: SortState,
): TRow[] {
    if (!sort) {
        return rows;
    }

    //TODO: custom sort.
    return rows.toSorted((rowA, rowB) => {
        const columnToSortBy = columns.find((col) => col.id === sort.columnId);
        if (!columnToSortBy) return 0;

        const valueA = columnToSortBy.accessor(rowA);
        const valueB = columnToSortBy.accessor(rowB);

        let result = 0;
        if (valueA < valueB) result = -1;
        else if (valueA > valueB) result = 1;
        return sort.direction === 'asc' ? result : -result;
    });
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
