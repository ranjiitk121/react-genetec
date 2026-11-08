import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { EventStatus, TimelineEvent } from '../shared/types';
import { groupEventsByDay } from '../shared/utils';

type TimelineProps = {
    events: TimelineEvent[];
};

const STATUS_COLOR_MAP: Record<EventStatus, string> = {
    completed: 'success.main', // green
    initiated: 'secondary.main', // purple
    started: 'error.main', // red
};

export function Timeline({ events }: TimelineProps) {
    //TODO: will be recomputed on all state changes
    const groups = groupEventsByDay(events);

    return (
        <Paper sx={{ width: '100%', maxWidth: 560, mx: 'auto', p: 3, textAlign: 'left' }}>
            <Stack spacing={0}>
                {groups.map((group, index) => {
                    // The connecting line is drawn per row but trimmed at the ends so it runs
                    // marker-to-marker: the first row starts at its marker, the last row stops
                    // at its marker, everything between spans the full row height.
                    const isFirst = index === 0;
                    const isLast = index === groups.length - 1;

                    return (
                        <Box
                            component="section"
                            key={group.dayKey}
                            sx={{ display: 'flex', gap: 2 }}
                        >
                            {/* 1 — date label */}
                            <Typography
                                variant="overline"
                                color="text.secondary"
                                sx={{ width: 80, flexShrink: 0, textAlign: 'right', pt: '2px' }}
                            >
                                {group.label}
                            </Typography>

                            {/* 2 — marker + connecting line */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: 16,
                                    flexShrink: 0,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '2px',
                                        bgcolor: 'divider',
                                        top: isFirst ? '12px' : 0,
                                        bottom: isLast ? 'calc(100% - 12px)' : 0,
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'relative',
                                        zIndex: 1,
                                        mt: '6px',
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        border: 2,
                                        borderColor: 'text.primary',
                                        bgcolor: 'background.paper',
                                    }}
                                />
                            </Box>

                            {/* 3 — the day's events */}
                            <Stack spacing={1} sx={{ flex: 1, pb: 3 }}>
                                {group.events.map((event) => (
                                    <Box key={event.id}>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {event.title}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: STATUS_COLOR_MAP[event.status],
                                                textTransform: 'capitalize',
                                            }}
                                        >
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
