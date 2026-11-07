import { useMemo, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import TableSortLabel from '@mui/material/TableSortLabel';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import type { Column, SortState } from './types';
import { getSortedRows } from './utils';

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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [sort, setSort] = useState<SortState>(null);

    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
    const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
    const menuOpen = Boolean(menuAnchorEl);

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, colId: string) => {
        event.stopPropagation();
        setMenuAnchorEl(event.currentTarget);
        setActiveColumnId(colId);
    };
    const handleCloseMenu = () => {
        setMenuAnchorEl(null);
        setActiveColumnId(null);
    };

    //TODO: add proper type
    const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // avoid landing past the end after a size change
    };

    const handleHeaderClick = (columnId: string) => {
        setSort((prev) => {
            if (!prev || prev.columnId !== columnId) return { columnId, direction: 'asc' };
            return { columnId, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
        });
    };

    const visibleIndexStart = page * rowsPerPage;
    const visibleIndexEnd = page * rowsPerPage + rowsPerPage;

    //TODO: will be recalculated on all the state changes, use Memo here
    //TODO: each column can have a custom sort? For example for Status like Error or warning and so on (need new config value for this)
    const sortedRows = useMemo(() => {
        return getSortedRows(rows, columns, sort);
    }, [rows, columns, sort]);

    const visibleRows = sortedRows.slice(visibleIndexStart, visibleIndexEnd);

    return (
        <TableContainer component={Paper}>
            <Table aria-label={label}>
                <TableHead>
                    <TableRow>
                        {columns.map((col) => {
                            const isActive = sort?.columnId === col.id;
                            const isMenuForThisCol = menuOpen && activeColumnId === col.id;
                            return (
                                <TableCell
                                    key={col.id}
                                    sortDirection={isActive ? sort!.direction : false}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        {col.sortable === false ? (
                                            col.label
                                        ) : (
                                            <TableSortLabel
                                                active={isActive}
                                                direction={isActive ? sort!.direction : 'asc'}
                                                onClick={() => handleHeaderClick(col.id)}
                                            >
                                                {col.label}
                                            </TableSortLabel>
                                        )}
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleOpenMenu(e, col.id)}
                                            aria-label={`Column options for ${col.label}`}
                                            aria-haspopup="true"
                                            aria-expanded={isMenuForThisCol}
                                            aria-controls={
                                                isMenuForThisCol ? 'column-actions-menu' : undefined
                                            }
                                        >
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            );
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {visibleRows.map((row) => (
                        <TableRow key={getRowKey(row)}>
                            {columns.map((col) => (
                                <TableCell key={col.id}>{getCellValue(col, row)}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={rows.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[25, 50, 100]}
            />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    px: 2,
                    py: 1,
                    borderTop: 1,
                    borderColor: 'divider',
                    color: 'text.secondary',
                    fontSize: 14,
                }}
            >
                {rows.length.toLocaleString()} rows
            </Box>
            <Menu
                id="column-actions-menu"
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={handleCloseMenu}
            />
        </TableContainer>
    );
}
