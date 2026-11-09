import type { SxProps, Theme } from '@mui/material/styles';

export const labelSx: SxProps<Theme> = {
    mb: 0.75,
    fontSize: 13,
    fontWeight: 500,
    color: 'text.primary',
};

export const requiredMarkSx: SxProps<Theme> = { color: 'error.main', ml: 0.25 };

export const errorTextSx: SxProps<Theme> = {
    mx: 0,
    mt: 0.75,
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
};

export const errorIconSx: SxProps<Theme> = { fontSize: 14 };

export const hintTextSx: SxProps<Theme> = { mx: 0, mt: 0.75 };

export const titleBarSx: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};

export const closeButtonSx: SxProps<Theme> = { color: 'text.secondary' };

export const contentStackSx: SxProps<Theme> = { pt: 1 };

export const actionsSx: SxProps<Theme> = {
    px: 3,
    py: 2,
    borderTop: 1,
    borderColor: 'divider',
    bgcolor: '#FAFBFC',
};
