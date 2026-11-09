import type { SxProps, Theme } from '@mui/material/styles';

export const pillSx = (bg: string, fg: string): SxProps<Theme> => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.75,
    height: 24,
    px: 1.25,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1,
    bgcolor: bg,
    color: fg,
});

export const dotSx = (color: string): SxProps<Theme> => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    bgcolor: color,
});
