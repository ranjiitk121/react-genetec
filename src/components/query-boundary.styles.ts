import type { SxProps, Theme } from '@mui/material/styles';

export const errorBoxSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1.5,
    py: 7,
    px: 3,
    textAlign: 'center',
};

export const errorIconSx: SxProps<Theme> = {
    width: 48,
    height: 48,
    borderRadius: '50%',
    bgcolor: 'error.light',
    color: 'error.main',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

export const errorMessageSx: SxProps<Theme> = { color: 'text.secondary', mt: 0.5, maxWidth: 360 };
