import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import type { Column } from '../shared/types';
import { footerSx } from './data-grid-skeleton.styles';
import { containerSx, toolbarBarSx } from './index.styles';

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
    const visibleColumns = columns.filter((col) => !col.hidden);

    return (
        <TableContainer component={Paper} elevation={0} aria-busy="true" sx={containerSx}>
            <LinearProgress sx={{ height: 3 }} />
            <Box sx={toolbarBarSx}>
                <Skeleton variant="rounded" width={96} height={30} />
            </Box>
            <Table aria-label={label}>
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
                                    {col.id === 'status' ? (
                                        <Skeleton
                                            variant="rounded"
                                            width={84}
                                            height={22}
                                            sx={{ borderRadius: 999 }}
                                        />
                                    ) : (
                                        <Skeleton
                                            variant="text"
                                            width={`${60 + ((rowIndex * 7) % 30)}%`}
                                        />
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Box sx={footerSx}>
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    Loading rows…
                </Typography>
            </Box>
        </TableContainer>
    );
}
