import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { TimelineEvent } from '../shared/types';
import { groupEventsByDay } from '../shared/utils';

type TimelineProps = {
    events: TimelineEvent[];
};

export function Timeline({ events }: TimelineProps) {
    //TODO: will be recomputed on all state changes
    const groups = groupEventsByDay(events);

    return (
        <Paper sx={{ width: '100%', maxWidth: 480, mx: 'auto', p: 3, textAlign: 'left' }}>
            <Stack spacing={3}>
                {groups.map((group) => (
                    <Box component="section" key={group.dayKey}>
                        <Typography variant="overline" color="text.secondary">
                            {group.label}
                        </Typography>
                        <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                            {group.events.map((event) => (
                                <Typography key={event.id} variant="body1">
                                    <Box
                                        component="span"
                                        sx={{
                                            color: 'text.secondary',
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        {event.status}
                                    </Box>{' '}
                                    {event.title}
                                </Typography>
                            ))}
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
}
