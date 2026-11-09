import type { SxProps, Theme } from '@mui/material/styles';

export const emptyStateSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1.5,
    py: 7,
    px: 3,
    textAlign: 'center',
};

export const emptyIconSx: SxProps<Theme> = {
    width: 48,
    height: 48,
    borderRadius: '50%',
    bgcolor: 'action.hover',
    color: 'text.secondary',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};
