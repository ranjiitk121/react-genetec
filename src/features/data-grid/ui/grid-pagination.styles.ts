import type { SxProps, Theme } from '@mui/material/styles';

export const rowCountBarSx: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'flex-end',
    px: 2,
    py: 1,
    borderTop: 1,
    borderColor: 'divider',
    color: 'text.secondary',
    fontSize: 14,
};
