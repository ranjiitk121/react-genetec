import type { SxProps, Theme } from '@mui/material/styles';

export const cardSx: SxProps<Theme> = {
    width: '100%',
    border: 1,
    borderColor: 'divider',
    borderRadius: 1.5,
    overflow: 'hidden',
    bgcolor: 'background.paper',
};

export const cardHeaderSx: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: 3,
    py: 2,
    borderBottom: 1,
    borderColor: 'divider',
};

export const paperSx: SxProps<Theme> = {
    width: '100%',
    p: 3,
    textAlign: 'left',
    height: 560,
    overflow: 'auto',
    border: 0,
    borderRadius: 0,
    boxShadow: 'none',
};
