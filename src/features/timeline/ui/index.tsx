import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { TimelineEvent } from '../shared/types';
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

type TimelineProps = {
    events: TimelineEvent[];
};

export function Timeline({ events }: TimelineProps) {
    //TODO: will be recomputed on all state changes
    const groups = groupEventsByDay(events);

    return (
        <Paper sx={paperSx}>
            <Stack spacing={0}>
                {groups.map((group, index) => {
                    const isFirst = index === 0;
                    const isLast = index === groups.length - 1;

                    return (
                        <Box component="section" key={group.dayKey} sx={rowSx}>
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
                    );
                })}
            </Stack>
        </Paper>
    );
}
