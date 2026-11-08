import type { SxProps, Theme } from '@mui/material/styles';

export const paperSx: SxProps<Theme> = {
    width: '100%',
    maxWidth: 560,
    mx: 'auto',
    p: 3,
    textAlign: 'left',
    // Bounded height so the virtualizer has a scroll viewport to measure against.
    height: 600,
    overflow: 'auto',
};
