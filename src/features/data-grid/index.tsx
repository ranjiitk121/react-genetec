import { useMemo, useRef, useState, useDeferredValue } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import type { Column, SortDirection, SortState, VisibilityState } from './types';
import { getFilteredRows, getSortedRows, isColumnVisible } from './utils';
import { ColumnHeaderCell } from './column-header-cell';
import { GridPagination } from './grid-pagination';

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
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [sort, setSort] = useState<SortState>(null);

    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
    const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
    const menuOpen = Boolean(menuAnchorEl);

    const [visibility, setVisibility] = useState<VisibilityState>({});
    const [manageAnchorEl, setManageAnchorEl] = useState<HTMLElement | null>(null);
    const manageOpen = Boolean(manageAnchorEl);

    const [filters, setFilters] = useState<Record<string, string>>({});
    //TODO: premeture optimization, fix later?
    const deferredFilters = useDeferredValue(filters);

    const handleFilterChange = (columnId: string, value: string) => {
        setFilters((prev) => ({ ...prev, [columnId]: value }));
        setPage(0); // filtering shrinks the list — jump back so results are visible
    };

    const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
    const [filterColumnId, setFilterColumnId] = useState<string | null>(null);
    const filterOpen = Boolean(filterAnchorEl);
    const filterInputRef = useRef<HTMLInputElement>(null);
    const filterColumn = columns.find((c) => c.id === filterColumnId) ?? null;

    const openFilter = (anchor: HTMLElement, colId: string) => {
        setFilterColumnId(colId);
        setFilterAnchorEl(anchor);
    };
    const closeFilter = () => {
        setFilterAnchorEl(null);
        setFilterColumnId(null);
    };
    const handleOpenFilterFromHeader = (
        event: React.MouseEvent<HTMLButtonElement>,
        colId: string,
    ) => openFilter(event.currentTarget, colId);
    const handleOpenFilterFromMenu = () => {
        if (menuAnchorEl && activeColumnId) openFilter(menuAnchorEl, activeColumnId);
        handleCloseMenu();
    };

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
    const setSortDirection = (columnId: string, direction: SortDirection) => {
        setSort({ columnId, direction });
    };

    const handleOpenManage = () => {
        setManageAnchorEl(menuAnchorEl); // reuse the ⋮ button as the anchor
        handleCloseMenu();
    };

    const toggleColumnVisibility = (col: Column<TRow>) => {
        setVisibility((prev) => ({ ...prev, [col.id]: !(prev[col.id] ?? !col.hidden) }));
    };

    const allVisible = columns.every((col) => isColumnVisible(col, visibility));
    const someVisible = columns.some((col) => isColumnVisible(col, visibility));
    const setAllVisibility = (visible: boolean) => {
        const next: VisibilityState = {};
        columns.forEach((col) => {
            next[col.id] = visible;
        });
        setVisibility(next);
    };
    const resetVisibility = () => setVisibility({});
    // TODO:

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
                                onSort={handleHeaderClick}
                                onOpenMenu={handleOpenMenu}
                                isMenuOpen={menuOpen && activeColumnId === col.id}
                                hasFilter={(filters[col.id] ?? '').trim() !== ''}
                                onOpenFilter={handleOpenFilterFromHeader}
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
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Menu
                id="column-actions-menu"
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={handleCloseMenu}
            >
                <MenuItem
                    onClick={() => {
                        if (activeColumnId) setSortDirection(activeColumnId, 'asc');
                        handleCloseMenu();
                    }}
                >
                    <ListItemIcon>
                        <ArrowUpwardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Sort Ascending</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        if (activeColumnId) setSortDirection(activeColumnId, 'desc');
                        handleCloseMenu();
                    }}
                >
                    <ListItemIcon>
                        <ArrowDownwardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Sort Descending</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleOpenFilterFromMenu}>
                    <ListItemIcon>
                        <FilterAltIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Filter</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleOpenManage}>
                    <ListItemIcon>
                        <ViewColumnIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Manage columns</ListItemText>
                </MenuItem>
            </Menu>
            <Menu
                anchorEl={manageAnchorEl}
                open={manageOpen}
                onClose={() => setManageAnchorEl(null)}
                //ADD LABEL
            >
                {columns.map((col) => (
                    <MenuItem key={col.id} onClick={() => toggleColumnVisibility(col)}>
                        <Checkbox
                            edge="start"
                            checked={isColumnVisible(col, visibility)}
                            size="small"
                            disableRipple
                        />
                        <ListItemText>{col.label}</ListItemText>
                    </MenuItem>
                ))}
                <Divider />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pr: 1,
                    }}
                >
                    {/* TODO: fix issue with inner menu jumping */}
                    <MenuItem sx={{ flex: 1 }} onClick={() => setAllVisibility(!allVisible)}>
                        <Checkbox
                            edge="start"
                            checked={allVisible}
                            indeterminate={someVisible && !allVisible}
                            size="small"
                            disableRipple
                        />
                        <ListItemText>Show/Hide All</ListItemText>
                    </MenuItem>
                    <Button size="small" onClick={resetVisibility}>
                        RESET
                    </Button>
                </Box>
            </Menu>
            <Popover
                open={filterOpen}
                anchorEl={filterAnchorEl}
                onClose={closeFilter}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                TransitionProps={{ onEntered: () => filterInputRef.current?.focus() }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5 }}>
                    <TextField
                        inputRef={filterInputRef}
                        size="small"
                        variant="outlined"
                        placeholder={`Filter ${filterColumn?.label ?? ''}…`}
                        aria-label={`Filter value for ${filterColumn?.label ?? ''}`}
                        value={filterColumnId ? (filters[filterColumnId] ?? '') : ''}
                        onChange={(e) =>
                            filterColumnId && handleFilterChange(filterColumnId, e.target.value)
                        }
                    />
                    <Button
                        size="small"
                        onClick={() => filterColumnId && handleFilterChange(filterColumnId, '')}
                        disabled={!filterColumnId || (filters[filterColumnId] ?? '').trim() === ''}
                    >
                        Clear
                    </Button>
                </Box>
            </Popover>
        </TableContainer>
    );
}
