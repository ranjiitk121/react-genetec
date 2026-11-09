import type { SxProps, Theme } from '@mui/material/styles';

export const rowSx: SxProps<Theme> = {
    '&:hover': { bgcolor: 'action.hover' },
    '&:last-child td': { border: 0 },
};
