import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';

import { EventsHeader, type View } from './components/events-header';
import { QueryBoundary } from './components/query-boundary';
import { DataGrid, DataGridSkeleton } from './features/data-grid';
import { EventForm, type EventFormValues } from './features/event-form';
import { Timeline, TimelineSkeleton, type TimelineEvent } from './features/timeline';
import { eventColumns } from './mocks/generate-timeline-data';
import { fetchEvents } from './mocks/fetch-events';

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

    function handleSave(values: EventFormValues) {
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
            <EventsHeader
                view={view}
                onViewChange={setView}
                onNewEvent={() => setFormOpen(true)}
                onSimulateError={simulateError}
            />

            <Snackbar
                open={!!savedMessage}
                autoHideDuration={SUCCESS_TIMEOUT_MS}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                onClose={(_event, reason) => {
                    if (reason === 'clickaway') return;
                    setSavedMessage('');
                }}
            >
                <Alert severity="success" component="output" onClose={() => setSavedMessage('')}>
                    {savedMessage}
                </Alert>
            </Snackbar>

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
                onSave={handleSave}
                onClose={() => setFormOpen(false)}
            />
        </Box>
    );
}

export default App;
