// Loading placeholder shaped like the real DataGrid: the same table chrome (Paper + header
// labels) with skeleton body rows, so the layout doesn't jump when data arrives. Rendered as
// <QueryBoundary>'s loadingFallback — the grid itself stays synchronous and never shows this.

import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import type { Column } from '../shared/types';

const SKELETON_ROWS = 8;

export function DataGridSkeleton<TRow>({
    columns,
    rows = SKELETON_ROWS,
    label,
}: {
    columns: Column<TRow>[];
    /** How many placeholder rows to show. */
    rows?: number;
    label?: string;
}) {
    // Match the grid's INITIAL render so the layout doesn't shift when data arrives: show the
    // columns visible by default (`!hidden`). Runtime show/hide toggles don't apply here — they
    // live in the grid's reducer, which doesn't exist yet while we're still loading.
    const visibleColumns = columns.filter((col) => !col.hidden);

    return (
        <TableContainer component={Paper}>
            <Table aria-label={label} aria-busy="true">
                <TableHead>
                    <TableRow>
                        {visibleColumns.map((col) => (
                            <TableCell key={col.id}>{col.label}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.from({ length: rows }, (_row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {visibleColumns.map((col) => (
                                <TableCell key={col.id}>
                                    <Skeleton variant="text" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
