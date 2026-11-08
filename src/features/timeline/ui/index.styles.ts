import type { SxProps, Theme } from '@mui/material/styles';

export const paperSx: SxProps<Theme> = {
    width: '100%',
    maxWidth: 560,
    mx: 'auto',
    p: 3,
    textAlign: 'left',
    // The Paper is the scroll container the virtualizer measures against — it needs a
    // bounded height, otherwise the list grows to full document height and there is
    // nothing to virtualize.
    height: 600,
    overflow: 'auto',
};
