import type { SxProps, Theme } from '@mui/material/styles';

export const containerSx: SxProps<Theme> = {
    border: 1,
    borderColor: 'divider',
    borderRadius: 1.5,
    overflow: 'hidden',
};

export const toolbarBarSx: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    px: 1.5,
    py: 1,
    borderBottom: 1,
    borderColor: 'divider',
};
