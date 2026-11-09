import { Activity, Suspense, lazy, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';

import { AppErrorBoundary } from './components/app-error-boundary';
import { EventsHeader, type View } from './components/events-header';
import { QueryBoundary } from './components/query-boundary';
import { DataGridSkeleton } from './features/data-grid/ui/data-grid-skeleton';
import type { EventFormValues } from './features/event-form';
import {
    Timeline,
    TimelineSkeleton,
    useTimelineGroups,
    type TimelineEvent,
} from './features/timeline';
import { eventColumns } from './mocks/generate-timeline-data';
import { fetchEvents } from './mocks/fetch-events';

const DataGrid = lazy(() =>
    import('./features/data-grid').then((m) => ({ default: m.DataGrid<TimelineEvent> })),
);
const EventForm = lazy(() =>
    import('./features/event-form').then((m) => ({ default: m.EventForm })),
);

const SUCCESS_TIMEOUT_MS = 6000;
const EMPTY_EVENTS: TimelineEvent[] = [];

function App() {
    const queryClient = useQueryClient();
    const [view, setView] = useState<View>('timeline');
    const [formOpen, setFormOpen] = useState(false);
    const [formMounted, setFormMounted] = useState(false);
    const [savedMessage, setSavedMessage] = useState('');

    const nextId = useRef(0);
    const failRef = useRef(false);

    const { data, status, error, refetch, isFetching } = useQuery({
        queryKey: ['events'],
        queryFn: () => fetchEvents({ count: 100_000, fail: failRef.current }),
    });
    const events = data ?? EMPTY_EVENTS;
    const { groups, isPending: groupsPending } = useTimelineGroups(events);

    function handleSave(values: EventFormValues) {
        const event: TimelineEvent = { id: `new-${nextId.current++}`, ...values };
        queryClient.setQueryData<TimelineEvent[]>(['events'], (prev) => [event, ...(prev ?? [])]);
        setFormOpen(false);
        setSavedMessage(`“${values.title}” was added to the grid and the timeline.`);
    }

    function openForm() {
        setFormMounted(true);
        setFormOpen(true);
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
                onNewEvent={openForm}
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
                <Activity mode={view === 'timeline' ? 'visible' : 'hidden'}>
                    <QueryBoundary
                        status={status}
                        isFetching={isFetching}
                        error={error}
                        onRetry={reload}
                        loadingFallback={<TimelineSkeleton />}
                    >
                        <AppErrorBoundary title="The timeline couldn’t render" resetKeys={[events]}>
                            <Timeline events={events} groups={groups} isPending={groupsPending} />
                        </AppErrorBoundary>
                    </QueryBoundary>
                </Activity>

                {view === 'grid' && (
                    <Suspense fallback={<DataGridSkeleton columns={eventColumns} label="Events" />}>
                        <QueryBoundary
                            status={status}
                            isFetching={isFetching}
                            error={error}
                            onRetry={reload}
                            loadingFallback={
                                <DataGridSkeleton columns={eventColumns} label="Events" />
                            }
                        >
                            <AppErrorBoundary title="The grid couldn’t render" resetKeys={[events]}>
                                <DataGrid
                                    columns={eventColumns}
                                    rows={events}
                                    getRowKey={(event) => event.id}
                                    label="Events"
                                    rowsPerPageOptions={[10, 25, 50]}
                                    defaultRowsPerPage={10}
                                />
                            </AppErrorBoundary>
                        </QueryBoundary>
                    </Suspense>
                )}
            </Box>
            {formMounted && (
                <Suspense fallback={null}>
                    <EventForm
                        key={formOpen ? 'open' : 'closed'}
                        open={formOpen}
                        onSave={handleSave}
                        onClose={() => setFormOpen(false)}
                    />
                </Suspense>
            )}
        </Box>
    );
}

export default App;
