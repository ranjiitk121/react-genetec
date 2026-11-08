import { memo, useMemo, useRef, type CSSProperties } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { TimelineEvent, TimelineGroup } from '../shared/types';
import { groupEventsByDay } from '../shared/utils';
import {
    dateSx,
    dotSx,
    eventsSx,
    lineSx,
    markerColumnSx,
    paperSx,
    rowSx,
    statusSx,
    titleSx,
} from './timeline-styles';

const PADDING = 24;
const PER_EVENT = 54;
const GAP = 8;

const OVERSCAN = 20;

const rowWrapperBaseStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    contain: 'layout paint style',
    willChange: 'transform',
};

type TimelineProps = {
    events: TimelineEvent[];
};

export function Timeline({ events }: TimelineProps) {
    // Memoised: the virtualizer re-renders on every scroll, and re-grouping 100k events each
    // frame would jank. Recompute only when the events array identity changes.
    const groups = useMemo(() => groupEventsByDay(events), [events]);

    const scrollRef = useRef<HTMLDivElement>(null);

    const rowHeight = (index: number) => {
        const count = groups[index].events.length;
        return PADDING + count * PER_EVENT + (count - 1) * GAP;
    };

    // TanStack Virtual's API can't be memoized by React Compiler; it opts this hook out safely.
    // oxlint-disable-next-line react/incompatible-library
    const virtualizer = useVirtualizer({
        count: groups.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: rowHeight,
        overscan: OVERSCAN,
    });

    return (
        <Paper ref={scrollRef} sx={paperSx}>
            {/* Spacer sized to the whole list; rendered rows are absolutely positioned inside it. */}
            <Box sx={{ position: 'relative', height: virtualizer.getTotalSize() }}>
                {virtualizer.getVirtualItems().map((virtualRow) => (
                    <TimelineRow
                        key={groups[virtualRow.index].dayKey}
                        index={virtualRow.index}
                        start={virtualRow.start}
                        group={groups[virtualRow.index]}
                        isFirst={virtualRow.index === 0}
                        isLast={virtualRow.index === groups.length - 1}
                        measureRef={virtualizer.measureElement}
                    />
                ))}
            </Box>
        </Paper>
    );
}

type TimelineRowProps = {
    index: number;
    start: number;
    group: TimelineGroup;
    isFirst: boolean;
    isLast: boolean;
    measureRef: (el: Element | null) => void;
};

const TimelineRow = memo(function TimelineRow({
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
