import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import type { Column } from '../shared/types';
import { GridEmptyRow } from './grid-empty-row';

function getCellValue<TRow>(column: Column<TRow>, row: TRow) {
    return column.cell ? column.cell(row) : column.accessor(row);
}

type GridBodyProps<TRow> = {
    columns: Column<TRow>[];
    rows: TRow[];
    getRowKey: (row: TRow) => string | number;
    /** Whether any filter is active — picks the right empty-state message. */
    hasActiveFilter: boolean;
};

export function GridBody<TRow>({ columns, rows, getRowKey, hasActiveFilter }: GridBodyProps<TRow>) {
    return (
        <TableBody>
            {rows.length === 0 ? (
                <GridEmptyRow columnCount={columns.length} filtered={hasActiveFilter} />
            ) : (
                rows.map((row) => (
                    <TableRow
                        key={getRowKey(row)}
                        sx={{
                            '&:hover': { bgcolor: 'action.hover' },
                            '&:last-child td': { border: 0 },
                        }}
                    >
                        {columns.map((col) => (
                            <TableCell key={col.id}>{getCellValue(col, row)}</TableCell>
                        ))}
                    </TableRow>
                ))
            )}
        </TableBody>
    );
}
