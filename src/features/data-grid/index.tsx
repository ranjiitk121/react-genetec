import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import type {Column} from "./types";
import { Box } from '@mui/material';


type FilterableTableProps<TRow> = {
    columns: Column<TRow>[];
    rows: TRow[];
    getRowKey: (row: TRow) => string | number;
    label?: string;
};

function getCellValue<TRow>(column: Column<TRow>, row: TRow) {
    return column.cell ? column.cell(row) : column.accessor(row);
}

export function DataGrid<TRow>({columns, rows, getRowKey, label }: FilterableTableProps<TRow>) {
    return (

        <TableContainer component={Paper}>
            <Table aria-label={label}>
                <TableHead>
                    <TableRow>
                           {columns.map(col => (
                            <TableCell key={col.id}>{col.label}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={getRowKey(row)}>
                            {/* Body maps over the SAME columns list as the header,
                                so cells always line up under their header. */}
                            {columns.map(col => (
                                <TableCell key={col.id}>{getCellValue(col, row)}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
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
        </TableContainer>
    );
}
