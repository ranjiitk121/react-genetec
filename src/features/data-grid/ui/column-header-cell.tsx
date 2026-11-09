import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TableSortLabel from '@mui/material/TableSortLabel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import type { Column, SortState } from '../shared/types';
import { activeCellSx, headerCellInnerSx } from './column-header-cell.styles';

type ColumnHeaderCellProps<TRow> = {
    column: Column<TRow>;
    sort: SortState;
    onSort: (columnId: string) => void;
    onOpenMenu: (event: React.MouseEvent<HTMLButtonElement>, colId: string) => void;
    isMenuOpen: boolean;
    hasFilter: boolean;
    onOpenFilter: (event: React.MouseEvent<HTMLButtonElement>, colId: string) => void;
};

export function ColumnHeaderCell<TRow>({
    column,
    sort,
    onSort,
    onOpenMenu,
    isMenuOpen,
    hasFilter,
    onOpenFilter,
}: ColumnHeaderCellProps<TRow>) {
    const isActive = sort?.columnId === column.id;

    return (
        <TableCell
            sortDirection={isActive ? sort!.direction : false}
            sx={isActive ? activeCellSx : undefined}
        >
            <Box sx={headerCellInnerSx}>
                {column.sortable === false ? (
                    column.label
                ) : (
                    <TableSortLabel
                        active={isActive}
                        direction={isActive ? sort!.direction : 'asc'}
                        onClick={() => onSort(column.id)}
                    >
                        {column.label}
                    </TableSortLabel>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {hasFilter && (
                        <Tooltip title={`Filter applied — edit ${column.label}`}>
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => onOpenFilter(e, column.id)}
                                aria-label={`Edit filter for ${column.label} (active)`}
                            >
                                <FilterAltIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <IconButton
                        size="small"
                        onClick={(e) => onOpenMenu(e, column.id)}
                        aria-label={`Column options for ${column.label}`}
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen}
                        aria-controls={isMenuOpen ? 'column-actions-menu' : undefined}
                    >
                        <MoreVertIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </TableCell>
    );
}
