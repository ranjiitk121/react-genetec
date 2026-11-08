// The grid's empty state — a synchronous concern (the given `rows` produced nothing to show).
// `filtered` distinguishes "no data at all" from "no rows match the active filters", which only
// the grid can tell apart. Loading/error are NOT here: they're the fetch's concern and live in
// <QueryBoundary> on top of the grid.

import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export function GridEmptyRow({
    columnCount,
    filtered,
}: {
    columnCount: number;
    filtered: boolean;
}) {
    return (
        <TableRow>
            <TableCell colSpan={columnCount}>
                <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                    {filtered ? 'No rows match the current filters.' : 'No data to display.'}
                </Box>
            </TableCell>
        </TableRow>
    );
}
