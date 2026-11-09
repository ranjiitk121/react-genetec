// Loading placeholder shaped like the real Timeline: the same card + header chrome with a few
// day-row skeletons (date label, marker dot, event lines), so the layout doesn't jump when data
// arrives. Rendered as <QueryBoundary>'s loadingFallback — the Timeline itself stays synchronous.

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { cardHeaderSx, cardSx, paperSx } from './index.styles';

const SKELETON_DAYS = 5;
const EVENTS_PER_DAY = 2;

export function TimelineSkeleton({ days = SKELETON_DAYS }: { days?: number }) {
    return (
        <Box sx={cardSx} aria-busy="true" aria-label="Loading timeline">
            <Box sx={cardHeaderSx}>
                <Typography variant="subtitle1">Timeline</Typography>
                <Skeleton variant="text" width={120} />
            </Box>
            <Paper elevation={0} sx={paperSx}>
                <Stack spacing={3}>
                    {Array.from({ length: days }, (_day, dayIndex) => (
                        <Box key={dayIndex} sx={{ display: 'flex', gap: 2 }}>
                            <Skeleton variant="circular" width={12} height={12} sx={{ mt: 0.5 }} />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton variant="text" width={100} />
                                <Stack spacing={1} sx={{ mt: 1 }}>
                                    {Array.from(
                                        { length: EVENTS_PER_DAY },
                                        (_event, eventIndex) => (
                                            <Skeleton
                                                key={eventIndex}
                                                variant="rounded"
                                                height={40}
                                            />
                                        ),
                                    )}
                                </Stack>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Paper>
        </Box>
    );
}
