import type { SxProps, Theme } from '@mui/material/styles';

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

export const EVENT_ITEM_HEIGHT = 44;

// Native :focus-visible ring (keyboard focus only); scroll-margin gives room when scrolled into view.
export const eventItemSx: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1.5,
    px: 1,
    mx: -1,
    height: EVENT_ITEM_HEIGHT,
    borderRadius: 1,
    scrollMarginBlock: 8,
    outline: 'none',
    '&:hover': { bgcolor: 'action.hover' },
    '&:focus-visible': {
        outline: '2px solid',
        outlineColor: 'primary.main',
        outlineOffset: 2,
    },
};

export const titleSx: SxProps<Theme> = {
    fontWeight: 500,
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
};
