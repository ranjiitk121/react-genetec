// All the Timeline's sx lives here so the component reads as structure, not styling.
// Theme tokens ('divider', 'text.primary', spacing numbers) resolve through the theme,
// same as inline sx — we've just given each blob a name and a home.

import type { SxProps, Theme } from '@mui/material/styles';

import type { EventStatus } from '../shared/types';

// Status -> MUI palette colour. Record<> forces an entry for every status.
export const STATUS_COLOR_MAP: Record<EventStatus, string> = {
    completed: 'success.main', // green
    initiated: 'secondary.main', // purple
    started: 'error.main', // red
};

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

// The connecting line is trimmed at the ends so it runs marker-to-marker:
// the first row starts at its marker, the last row stops at its marker.
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

export const titleSx: SxProps<Theme> = { fontWeight: 500 };

export const statusSx = (status: EventStatus): SxProps<Theme> => ({
    color: STATUS_COLOR_MAP[status],
    textTransform: 'capitalize',
});
