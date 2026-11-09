/* oxlint-disable jsx-a11y/prefer-tag-over-role */
import { memo, type CSSProperties } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { StatusPill } from '../../../components/status-pill';
import type { TimelineGroup } from '../shared/types';
import { eventAriaLabel } from '../shared/utils';
import {
    dateSx,
    dotSx,
    eventItemSx,
    eventsSx,
    lineSx,
    markerColumnSx,
    rowSx,
    titleSx,
} from './timeline-row.styles';

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
    tabbableItemIndex: number; // item with roving tabIndex=0, else -1
    cursorItemIndex: number; // item the keyboard cursor is on, else -1
    cursorRef: (el: HTMLDivElement | null) => void;
    onItemFocus: (groupIndex: number, itemIndex: number) => void;
};

// memo so rows re-render only when their data/offset changes, not on every scroll frame.
export const TimelineRow = memo(function TimelineRow({
    index,
    start,
    group,
    isFirst,
    isLast,
    tabbableItemIndex,
    cursorItemIndex,
    cursorRef,
    onItemFocus,
}: TimelineRowProps) {
    return (
        <div
            data-index={index}
            role="presentation"
            style={{ ...rowWrapperBaseStyle, transform: `translateY(${start}px)` }}
        >
            <Box component="section" role="group" aria-label={group.label} sx={rowSx}>
                <Typography variant="overline" color="text.secondary" sx={dateSx} aria-hidden>
                    {group.label}
                </Typography>

                <Box sx={markerColumnSx} aria-hidden>
                    <Box sx={lineSx(isFirst, isLast)} />
                    <Box sx={dotSx} />
                </Box>

                <Stack spacing={1} sx={eventsSx}>
                    {group.events.map((event, itemIndex) => (
                        <Box
                            key={event.id}
                            ref={itemIndex === cursorItemIndex ? cursorRef : undefined}
                            role="listitem"
                            tabIndex={itemIndex === tabbableItemIndex ? 0 : -1}
                            aria-label={eventAriaLabel(event)}
                            onFocus={() => onItemFocus(index, itemIndex)}
                            sx={eventItemSx}
                        >
                            <Typography variant="body1" sx={titleSx}>
                                {event.title}
                            </Typography>
                            <StatusPill status={event.status} />
                        </Box>
                    ))}
                </Stack>
            </Box>
        </div>
    );
});
