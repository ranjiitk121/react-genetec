import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { QueryBoundary } from './components/query-boundary';
import { DataGrid, DataGridSkeleton } from './features/data-grid';
import { EventForm, type EventFormValues } from './features/event-form';
import { Timeline, type TimelineEvent } from './features/timeline';
import { eventColumns } from './mocks/generate-timeline-data';
import { fetchEvents } from './mocks/fetch-events';

type View = 'timeline' | 'grid' | 'form';

function App() {
    const queryClient = useQueryClient();
    const [view, setView] = useState<View>('timeline');

    // The form emits a draft without an id; App owns the id scheme (unique + sortable).
    const nextId = useRef(0);
    // Read at fetch time (not closed over), so the demo buttons can flip the next result.
    const failRef = useRef(false);

    const { data, status, error, refetch } = useQuery({
        queryKey: ['events'],
        queryFn: () => fetchEvents({ count: 200_000, fail: failRef.current }),
    });
    const events = data ?? [];

    function addEvent(values: EventFormValues) {
        const event: TimelineEvent = { id: `new-${nextId.current++}`, ...values };
        queryClient.setQueryData<TimelineEvent[]>(['events'], (prev) => [event, ...(prev ?? [])]);
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
        <section id="center">
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Button size="small" onClick={reload}>
                    Reload
                </Button>
                <Button size="small" color="error" onClick={simulateError}>
                    Simulate error
                </Button>
            </Stack>

            <Tabs value={view} onChange={(_event, next: View) => setView(next)}>
                <Tab value="timeline" label="Timeline" />
                <Tab value="grid" label="Grid" />
                <Tab value="form" label="New Event" />
            </Tabs>

            <Box sx={{ mt: 2 }}>
                {view === 'form' ? (
                    <EventForm onSave={addEvent} onCancel={() => setView('timeline')} />
                ) : (
                    <QueryBoundary
                        status={status}
                        error={error}
                        onRetry={reload}
                        loadingFallback={<DataGridSkeleton columns={eventColumns} label="Events" />}
                    >
                        {view === 'timeline' && <Timeline events={events} />}
                        {view === 'grid' && (
                            <DataGrid<TimelineEvent>
                                columns={eventColumns}
                                rows={events}
                                getRowKey={(event) => event.id}
                                label="Events"
                                rowsPerPageOptions={[10, 25, 50, 100]}
                                defaultRowsPerPage={10}
                            />
                        )}
                    </QueryBoundary>
                )}
            </Box>
        </section>
    );
}

export default App;
