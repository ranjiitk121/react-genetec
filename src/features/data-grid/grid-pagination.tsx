import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';

type GridPaginationProps = {
    count: number;
    page: number;
    onPageChange: (event: unknown, newPage: number) => void;
    rowsPerPage: number;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rowsPerPageOptions?: number[];
};

export function GridPagination({
    count,
    page,
    onPageChange,
    rowsPerPage,
    onRowsPerPageChange,
    rowsPerPageOptions = [5, 10, 25, 50, 100],
}: GridPaginationProps) {
    return (
        <>
            <TablePagination
                component="div"
                count={count}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={rowsPerPageOptions}
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
                {count.toLocaleString()} rows
            </Box>
        </>
    );
}
