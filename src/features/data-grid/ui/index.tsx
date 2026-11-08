import { useDeferredValue, useMemo, useReducer } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import type { Column } from '../shared/types';
import { getFilteredRows, getSortedRows, isColumnVisible } from '../shared/utils';
import { gridReducer, initGridState } from '../state/grid-reducer';
import { ColumnHeaderCell } from './column-header-cell';
import { GridPagination } from './grid-pagination';
import { ColumnActionsMenu } from './column-actions-menu';
import { FilterPopover } from './filter-popover';
import { ManageColumnsMenu } from './manage-columns-menu';

type FilterableTableProps<TRow> = {
    columns: Column<TRow>[];
    rows: TRow[];
    getRowKey: (row: TRow) => string | number;
    label?: string;
};
function getCellValue<TRow>(column: Column<TRow>, row: TRow) {
    return column.cell ? column.cell(row) : column.accessor(row);
}

export function DataGrid<TRow>({ columns, rows, getRowKey, label }: FilterableTableProps<TRow>) {
    const [state, dispatch] = useReducer(gridReducer, undefined, initGridState);
    const { sort, filters, visibility, page, rowsPerPage, overlay } = state;

    // Keep typing responsive — the expensive filtering pass reads the deferred copy.
    const deferredFilters = useDeferredValue(filters);

    // Everything below is DERIVED from `overlay` — there is no separate "is open"
    // state to keep in sync, and only one overlay can ever be open.
    const actionsAnchorEl = overlay.kind === 'actions' ? overlay.anchorEl : null;
    const filterAnchorEl = overlay.kind === 'filter' ? overlay.anchorEl : null;
    const manageAnchorEl = overlay.kind === 'manage' ? overlay.anchorEl : null;
    const filterColumnId = overlay.kind === 'filter' ? overlay.columnId : null;
    const filterColumn = columns.find((c) => c.id === filterColumnId) ?? null;

    const visibleColumns = useMemo(
        () => columns.filter((col) => isColumnVisible(col, visibility)),
        [columns, visibility],
    );

    const visibleIndexStart = page * rowsPerPage;
    const visibleIndexEnd = page * rowsPerPage + rowsPerPage;

    const filteredRows = useMemo(
        () => getFilteredRows(rows, columns, deferredFilters),
        [rows, columns, deferredFilters],
    );

    //TODO: each column can have a custom sort? For example for Status like Error or warning and so on (need new config value for this)
    const sortedRows = useMemo(() => {
        return getSortedRows(filteredRows, columns, sort);
    }, [filteredRows, columns, sort]);

    const visibleRows = sortedRows.slice(visibleIndexStart, visibleIndexEnd);

    return (
        <TableContainer component={Paper}>
            <Table aria-label={label}>
                <TableHead>
                    <TableRow>
                        {visibleColumns.map((col) => (
                            <ColumnHeaderCell
                                key={col.id}
                                column={col}
                                sort={sort}
                                onSort={(columnId) => dispatch({ type: 'headerClicked', columnId })}
                                onOpenMenu={(event, colId) => {
                                    event.stopPropagation();
                                    dispatch({
                                        type: 'actionsMenuOpened',
                                        anchorEl: event.currentTarget,
                                        columnId: colId,
                                    });
                                }}
                                isMenuOpen={
                                    overlay.kind === 'actions' && overlay.columnId === col.id
                                }
                                hasFilter={(filters[col.id] ?? '').trim() !== ''}
                                onOpenFilter={(event, colId) =>
                                    dispatch({
                                        type: 'filterOpenedFromHeader',
                                        anchorEl: event.currentTarget,
                                        columnId: colId,
                                    })
                                }
                            />
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {visibleRows.map((row) => (
                        <TableRow key={getRowKey(row)}>
                            {visibleColumns.map((col) => (
                                <TableCell key={col.id}>{getCellValue(col, row)}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <GridPagination
                count={filteredRows.length}
                page={page}
                onPageChange={(_event, newPage) => dispatch({ type: 'pageChanged', page: newPage })}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) =>
                    dispatch({
                        type: 'rowsPerPageChanged',
                        rowsPerPage: parseInt(event.target.value, 10),
                    })
                }
            />
            <ColumnActionsMenu
                anchorEl={actionsAnchorEl}
                open={overlay.kind === 'actions'}
                onClose={() => dispatch({ type: 'overlayClosed' })}
                onSortAsc={() => dispatch({ type: 'sortSelected', direction: 'asc' })}
                onSortDesc={() => dispatch({ type: 'sortSelected', direction: 'desc' })}
                onFilter={() => dispatch({ type: 'filterOpenedFromMenu' })}
                onManageColumns={() => dispatch({ type: 'manageOpened' })}
            />
            <ManageColumnsMenu
                anchorEl={manageAnchorEl}
                open={overlay.kind === 'manage'}
                onClose={() => dispatch({ type: 'overlayClosed' })}
                columns={columns}
                visibility={visibility}
                onToggleColumn={(col) =>
                    dispatch({ type: 'columnToggled', columnId: col.id, hidden: col.hidden })
                }
                onSetAllVisibility={(visible) =>
                    dispatch({
                        type: 'allColumnsVisibilitySet',
                        columnIds: columns.map((c) => c.id),
                        visible,
                    })
                }
                onReset={() => dispatch({ type: 'columnVisibilityReset' })}
            />
            <FilterPopover
                open={overlay.kind === 'filter'}
                anchorEl={filterAnchorEl}
                onClose={() => dispatch({ type: 'overlayClosed' })}
                label={filterColumn?.label ?? ''}
                value={filterColumnId ? (filters[filterColumnId] ?? '') : ''}
                onChange={(value) =>
                    filterColumnId &&
                    dispatch({ type: 'filterChanged', columnId: filterColumnId, value })
                }
                onClear={() =>
                    filterColumnId &&
                    dispatch({ type: 'filterChanged', columnId: filterColumnId, value: '' })
                }
            />
        </TableContainer>
    );
}
