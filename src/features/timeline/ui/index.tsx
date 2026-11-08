/* oxlint-disable jsx-a11y/prefer-tag-over-role */
import { useCallback, useEffect, useMemo, useReducer, useRef, type KeyboardEvent } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import type { Direction, TimelineEvent } from '../shared/types';
import { groupEventsByDay, nextFocusPosition } from '../shared/utils';
import { initTimelineState, timelineReducer } from '../state/timeline-reducer';
import { paperSx } from './index.styles';
import { TimelineRow } from './timeline-row';

// Exact per-row height: PADDING + events × PER_EVENT + (events − 1) × GAP.
const PADDING = 24;
const PER_EVENT = 54;
const GAP = 8;
const OVERSCAN = 20;

const KEY_TO_DIRECTION: Record<string, Direction> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
};

type TimelineProps = {
    events: TimelineEvent[];
};

export function Timeline({ events }: TimelineProps) {
    const groups = useMemo(() => groupEventsByDay(events), [events]);
    const groupSizes = useMemo(() => groups.map((group) => group.events.length), [groups]);

    const scrollRef = useRef<HTMLDivElement>(null);

    // oxlint-disable-next-line react/incompatible-library
    const virtualizer = useVirtualizer({
        count: groups.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: (index) => {
            const count = groupSizes[index];
            return PADDING + count * PER_EVENT + (count - 1) * GAP;
        },
        overscan: OVERSCAN,
    });

    const [state, dispatch] = useReducer(timelineReducer, undefined, initTimelineState);
    const { focus } = state;

    // Focus the keyboard target once it mounts: set here, consumed by focusCursorItem.
    const pendingKeyboardFocus = useRef(false);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const direction = KEY_TO_DIRECTION[event.key];
        if (!direction) return;
        event.preventDefault();

        const target = nextFocusPosition(groupSizes, focus, direction);
        if (target === focus) return;

        pendingKeyboardFocus.current = true;
        virtualizer.scrollToIndex(target.groupIndex, { align: 'auto' });
        dispatch({ type: 'navigated', direction, groupSizes });
    };

    const handleItemFocus = useCallback((groupIndex: number, itemIndex: number) => {
        dispatch({ type: 'focused', position: { groupIndex, itemIndex } });
    }, []);

    useEffect(() => {
        dispatch({ type: 'groupsChanged', groupSizes });
    }, [groupSizes]);

    const focusCursorItem = useCallback((el: HTMLDivElement | null) => {
        if (el && pendingKeyboardFocus.current) {
            el.focus({ preventScroll: true });
            pendingKeyboardFocus.current = false;
        }
    }, []);

    const virtualItems = virtualizer.getVirtualItems();

    // One tabbable item among rendered rows: the cursor, or the first visible row if it scrolled off.
    const focusRendered = virtualItems.some((row) => row.index === focus.groupIndex);
    const tabStop = focusRendered
        ? focus
        : { groupIndex: virtualItems[0]?.index ?? focus.groupIndex, itemIndex: 0 };

    return (
        <Paper
            ref={scrollRef}
            sx={paperSx}
            role="list"
            aria-label={`Event timeline, ${groups.length} days`}
            onKeyDown={handleKeyDown}
        >
            <Box
                role="presentation"
                sx={{ position: 'relative', height: virtualizer.getTotalSize() }}
            >
                {virtualItems.map((virtualRow) => (
                    <TimelineRow
                        key={groups[virtualRow.index].dayKey}
                        index={virtualRow.index}
                        start={virtualRow.start}
                        group={groups[virtualRow.index]}
                        isFirst={virtualRow.index === 0}
                        isLast={virtualRow.index === groups.length - 1}
                        measureRef={virtualizer.measureElement}
                        tabbableItemIndex={
                            tabStop.groupIndex === virtualRow.index ? tabStop.itemIndex : -1
                        }
                        cursorItemIndex={
                            focus.groupIndex === virtualRow.index ? focus.itemIndex : -1
                        }
                        cursorRef={focusCursorItem}
                        onItemFocus={handleItemFocus}
                    />
                ))}
            </Box>
        </Paper>
    );
}
