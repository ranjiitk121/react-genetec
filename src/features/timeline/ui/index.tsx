import { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import type { TimelineEvent } from '../shared/types';
import { groupEventsByDay } from '../shared/utils';
import { paperSx } from './index.styles';
import { TimelineRow } from './timeline-row';

// Exact per-row height, measured against the DOM: 1 event = 78px, 2 = 140px, 3 = 202px.
// An exact estimate keeps measureElement from causing a visible correction on fast scroll.
const PADDING = 24; // the row's bottom padding, present at any event count
const PER_EVENT = 54; // one event block (its title + status line)
const GAP = 8; // space BETWEEN two events; there are (events − 1) of them

// Extra rows rendered above/below the viewport. Higher = fewer blank frames on fast scroll.
const OVERSCAN = 20;

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
