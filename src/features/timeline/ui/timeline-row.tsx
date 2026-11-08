import { memo, type CSSProperties } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { TimelineGroup } from '../shared/types';
import {
    dateSx,
    dotSx,
    eventsSx,
    lineSx,
    markerColumnSx,
    rowSx,
    statusSx,
    titleSx,
} from './timeline-styles';

// Positioning wrapper style, hoisted so it isn't re-created per row per render (the transform,
// which changes per row, is spread on at render time). `contain` isolates each row's layout/paint;
// `will-change: transform` keeps the translateY on the compositor.
const rowWrapperBaseStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    contain: 'layout paint style',
    willChange: 'transform',
};

type TimelineRowProps = {
    index: number;
    start: number;
    group: TimelineGroup;
    isFirst: boolean;
    isLast: boolean;
    measureRef: (el: Element | null) => void;
};

// memo: the virtualizer re-renders the Timeline on every scroll frame, but a row's props don't
// change while scrolling — so without memo every visible MUI subtree reconciled on every frame,
// blocking the main thread. With memo a row re-renders only when its offset or data changes.
export const TimelineRow = memo(function TimelineRow({
    index,
    start,
    group,
    isFirst,
    isLast,
    measureRef,
}: TimelineRowProps) {
    return (
        // Plain <div>, not MUI <Box>: this positioning wrapper is the hot path. Inline styles skip
        // Emotion; measureElement reads the real height here via data-index.
        <div
            data-index={index}
            ref={measureRef}
            style={{ ...rowWrapperBaseStyle, transform: `translateY(${start}px)` }}
        >
            <Box component="section" sx={rowSx}>
                {/* 1 — date label */}
                <Typography variant="overline" color="text.secondary" sx={dateSx}>
                    {group.label}
                </Typography>

                {/* 2 — marker + connecting line */}
                <Box sx={markerColumnSx}>
                    <Box sx={lineSx(isFirst, isLast)} />
                    <Box sx={dotSx} />
                </Box>

                {/* 3 — the day's events */}
                <Stack spacing={1} sx={eventsSx}>
                    {group.events.map((event) => (
                        <Box key={event.id}>
                            <Typography variant="body1" sx={titleSx}>
                                {event.title}
                            </Typography>
                            <Typography variant="caption" sx={statusSx(event.status)}>
                                {event.status}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </div>
    );
});
