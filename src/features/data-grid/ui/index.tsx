import { useMemo, useReducer } from 'react';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

import type { Column } from '../shared/types';
import {
    getFilteredRows,
    getSortedRows,
    getVisibleColumns,
    hasActiveFilters,
    paginate,
} from '../shared/utils';
import { gridReducer, initGridState } from '../state/grid-reducer';
import { selectOverlay } from '../state/grid-selectors';
import { containerSx } from './index.styles';
import { GridToolbar } from './grid-toolbar';
import { GridHeader } from './grid-header';
import { GridBody } from './grid-body';
import { GridPagination } from './grid-pagination';
import { ColumnActionsMenu } from './column-actions-menu';
import { FilterPopover } from './filter-popover';
import { ManageColumnsMenu } from './manage-columns-menu';
import { useDebouncedValue } from './use-debounced-value';

export { DataGridSkeleton } from './data-grid-skeleton';

const FILTER_DEBOUNCE_MS = 200;

type FilterableTableProps<TRow> = {
    columns: Column<TRow>[];
    rows: TRow[];
    getRowKey: (row: TRow) => string | number;
    label?: string;
    rowsPerPageOptions?: number[];
    defaultRowsPerPage?: number;
};

export function DataGrid<TRow>({
    columns,
    rows,
    getRowKey,
    label,
    rowsPerPageOptions = [5, 10, 25, 50, 100],
    defaultRowsPerPage,
}: FilterableTableProps<TRow>) {
    const [state, dispatch] = useReducer(gridReducer, undefined, () =>
        initGridState(defaultRowsPerPage ?? rowsPerPageOptions[0]),
    );
    const { sort, filters, visibility, page, rowsPerPage } = state;
    const debouncedFilters = useDebouncedValue(filters, FILTER_DEBOUNCE_MS);
    const visibleColumns = useMemo(
        () => getVisibleColumns(columns, visibility),
        [columns, visibility],
    );
    const filteredRows = useMemo(
        () => getFilteredRows(rows, columns, debouncedFilters),
        [rows, columns, debouncedFilters],
    );
    const sortedRows = useMemo(
        () => getSortedRows(filteredRows, columns, sort),
        [filteredRows, columns, sort],
    );
    const visibleRows = paginate(sortedRows, page, rowsPerPage);
    const overlay = selectOverlay(state.overlay, columns);
    const hasActiveFilter = hasActiveFilters(filters);
    const closeOverlay = () => dispatch({ type: 'overlayClosed' });
    const changeFilter = (value: string) => {
        if (overlay.filterColumnId) {
            dispatch({ type: 'filterChanged', columnId: overlay.filterColumnId, value });
        }
    };

    return (
        <TableContainer component={Paper} elevation={0} sx={containerSx}>
            <GridToolbar
                isManageOpen={overlay.isManageOpen}
                onManageColumns={(event) =>
                    dispatch({ type: 'manageOpened', anchorEl: event.currentTarget })
                }
            />
            <Table aria-label={label}>
                <GridHeader
                    columns={visibleColumns}
                    sort={sort}
                    filters={filters}
                    activeActionsColumnId={overlay.activeActionsColumnId}
                    onSort={(columnId) => dispatch({ type: 'headerClicked', columnId })}
                    onOpenMenu={(event, columnId) => {
                        event.stopPropagation();
                        dispatch({
                            type: 'actionsMenuOpened',
                            anchorEl: event.currentTarget,
                            columnId,
                        });
                    }}
                    onOpenFilter={(event, columnId) =>
                        dispatch({
                            type: 'filterOpenedFromHeader',
                            anchorEl: event.currentTarget,
                            columnId,
                        })
                    }
                />
                <GridBody
                    columns={visibleColumns}
                    rows={visibleRows}
                    getRowKey={getRowKey}
                    hasActiveFilter={hasActiveFilter}
                />
            </Table>
            <GridPagination
                count={filteredRows.length}
                page={page}
                onPageChange={(_event, nextPage) =>
                    dispatch({ type: 'pageChanged', page: nextPage })
                }
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) =>
                    dispatch({
                        type: 'rowsPerPageChanged',
                        rowsPerPage: parseInt(event.target.value, 10),
                    })
                }
                rowsPerPageOptions={rowsPerPageOptions}
            />
            <ColumnActionsMenu
                anchorEl={overlay.actionsAnchorEl}
                open={overlay.isActionsOpen}
                onClose={closeOverlay}
                onSortAsc={() => dispatch({ type: 'sortSelected', direction: 'asc' })}
                onSortDesc={() => dispatch({ type: 'sortSelected', direction: 'desc' })}
                onFilter={() => dispatch({ type: 'filterOpenedFromMenu' })}
            />
            <ManageColumnsMenu
                anchorEl={overlay.manageAnchorEl}
                open={overlay.isManageOpen}
                onClose={closeOverlay}
                columns={columns}
                visibility={visibility}
                onToggleColumn={(col) =>
                    dispatch({ type: 'columnToggled', columnId: col.id, hidden: col.hidden })
                }
                onReset={() => dispatch({ type: 'columnVisibilityReset' })}
            />
            <FilterPopover
                open={overlay.isFilterOpen}
                anchorEl={overlay.filterAnchorEl}
                onClose={closeOverlay}
                label={overlay.filterColumn?.label ?? ''}
                value={overlay.filterColumnId ? (filters[overlay.filterColumnId] ?? '') : ''}
                onChange={changeFilter}
                onClear={() => changeFilter('')}
            />
        </TableContainer>
    );
}
