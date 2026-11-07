import type { Column, SortState } from './types';

export function getSortedRows<TRow>(
    rows: TRow[],
    columns: Column<TRow>[],
    sort: SortState,
): TRow[] {
    if (!sort) {
        return rows;
    }

    //TODO: custom sort.
    return rows.sort((rowA, rowB) => {
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
