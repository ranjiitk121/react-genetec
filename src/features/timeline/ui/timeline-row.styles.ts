import type { SxProps, Theme } from '@mui/material/styles';

import type { EventStatus } from '../shared/types';
import { STATUS_COLOR_MAP } from '../shared/utils';

export const rowSx: SxProps<Theme> = { display: 'flex', gap: 2 };

export const dateSx: SxProps<Theme> = {
    width: 80,
    flexShrink: 0,
    textAlign: 'right',
    pt: '2px',
};

export const markerColumnSx: SxProps<Theme> = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    width: 16,
    flexShrink: 0,
};

export const lineSx = (isFirst: boolean, isLast: boolean): SxProps<Theme> => ({
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '2px',
    bgcolor: 'divider',
    top: isFirst ? '12px' : 0,
    bottom: isLast ? 'calc(100% - 12px)' : 0,
});

export const dotSx: SxProps<Theme> = {
    position: 'relative',
    zIndex: 1,
    mt: '6px',
    width: 12,
    height: 12,
    borderRadius: '50%',
    border: 2,
    borderColor: 'text.primary',
    bgcolor: 'background.paper',
};

export const eventsSx: SxProps<Theme> = { flex: 1, pb: 3 };

// Native :focus-visible ring (keyboard focus only); scroll-margin gives room when scrolled into view.
export const eventItemSx: SxProps<Theme> = {
    px: 1,
    mx: -1,
    borderRadius: 1,
    scrollMarginBlock: 8,
    outline: 'none',
    '&:focus-visible': {
        outline: '2px solid',
        outlineColor: 'primary.main',
        outlineOffset: 2,
    },
};

export const titleSx: SxProps<Theme> = { fontWeight: 500 };

// .dark shade in light mode, .main in dark mode — MUI's defaults don't clear WCAG AA 4.5:1 on the paper.
export const statusSx =
    (status: EventStatus): SxProps<Theme> =>
    (theme) => ({
        color: theme.palette[STATUS_COLOR_MAP[status]][
            theme.palette.mode === 'light' ? 'dark' : 'main'
        ],
        textTransform: 'capitalize',
    });
