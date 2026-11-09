import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmberRounded';

import { QueryBoundary } from './components/query-boundary';
import { DataGrid, DataGridSkeleton } from './features/data-grid';
import { EventForm, type EventFormValues } from './features/event-form';
import { Timeline, TimelineSkeleton, type TimelineEvent } from './features/timeline';
import { eventColumns } from './mocks/generate-timeline-data';
import { fetchEvents } from './mocks/fetch-events';

type View = 'timeline' | 'grid';

const SUCCESS_TIMEOUT_MS = 6000;

function App() {
    const queryClient = useQueryClient();
    const [view, setView] = useState<View>('timeline');
    const [formOpen, setFormOpen] = useState(false);
    const [savedMessage, setSavedMessage] = useState('');

    const nextId = useRef(0);
    const failRef = useRef(false);

    const { data, status, error, refetch, isFetching } = useQuery({
        queryKey: ['events'],
        queryFn: () => fetchEvents({ count: 200_000, fail: failRef.current }),
    });
    const events = data ?? [];

    useEffect(() => {
        if (!savedMessage) return;
        const timer = setTimeout(() => setSavedMessage(''), SUCCESS_TIMEOUT_MS);
        return () => clearTimeout(timer);
    }, [savedMessage]);

    function addEvent(values: EventFormValues) {
        const event: TimelineEvent = { id: `new-${nextId.current++}`, ...values };
        queryClient.setQueryData<TimelineEvent[]>(['events'], (prev) => [event, ...(prev ?? [])]);
        setFormOpen(false);
        setSavedMessage(`“${values.title}” was added to the grid and the timeline.`);
    }

    function reload() {
        failRef.current = false;
        refetch();
    }

    function simulateError() {
        failRef.current = true;
        refetch();
    }

    return (
        <Box component="main" sx={{ textAlign: 'left' }}>
            <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'flex-end', gap: 2 }}
            >
                <Box>
                    <Typography variant="overline" sx={{ color: 'primary.main' }}>
                        Events console
                    </Typography>
                    <Typography variant="h4">Events</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        Browse the timeline, search the grid, and add new events.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ flexShrink: 0, alignItems: 'center' }}>
                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<WarningAmberIcon />}
                        onClick={simulateError}
                    >
                        Simulate error
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setFormOpen(true)}
                    >
                        New event
                    </Button>
                </Stack>
            </Stack>

            <Tabs
                value={view}
                onChange={(_event, next: View) => setView(next)}
                sx={{ mt: 3, borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab value="timeline" label="Timeline" />
                <Tab value="grid" label="Grid" />
            </Tabs>

            {savedMessage && (
                <Alert
                    severity="success"
                    component="output"
                    onClose={() => setSavedMessage('')}
                    sx={{ mt: 3 }}
                >
                    {savedMessage}
                </Alert>
            )}

            <Box sx={{ mt: 3 }}>
                {view === 'timeline' && (
                    <QueryBoundary
                        status={status}
                        isFetching={isFetching}
                        error={error}
                        onRetry={reload}
                        loadingFallback={<TimelineSkeleton />}
                    >
                        <Timeline events={events} />
                    </QueryBoundary>
                )}

                {view === 'grid' && (
                    <QueryBoundary
                        status={status}
                        isFetching={isFetching}
                        error={error}
                        onRetry={reload}
                        loadingFallback={<DataGridSkeleton columns={eventColumns} label="Events" />}
                    >
                        <DataGrid<TimelineEvent>
                            columns={eventColumns}
                            rows={events}
                            getRowKey={(event) => event.id}
                            label="Events"
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            defaultRowsPerPage={10}
                        />
                    </QueryBoundary>
                )}
            </Box>
            <EventForm
                key={formOpen ? 'open' : 'closed'}
                open={formOpen}
                onSave={addEvent}
                onClose={() => setFormOpen(false)}
            />
        </Box>
    );
}

export default App;
