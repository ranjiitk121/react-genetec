import type { SxProps, Theme } from '@mui/material/styles';

import { tokens } from '../../../theme';

export const activeCellSx: SxProps<Theme> = (theme) => ({
    bgcolor: tokens.primarySoft,
    color: 'primary.dark',
    boxShadow: `inset 0 -2px 0 ${theme.palette.primary.main}`,
});

export const headerCellInnerSx: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};

export const sortLabelSx: SxProps<Theme> = {
    '& .MuiTableSortLabel-icon': { opacity: 0 },
    '&:hover .MuiTableSortLabel-icon': { opacity: 0 },
    '&.Mui-active .MuiTableSortLabel-icon': { opacity: 1 },
};
