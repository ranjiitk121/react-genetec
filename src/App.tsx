//import { useQuery } from '@tanstack/react-query';

// import { DataGrid, DataGridSkeleton } from './features/data-grid';
// import { QueryBoundary } from './components/query-boundary';
// import { personColumns, type PersonRow } from './mocks/generate-grid-data';
// import { fetchPeople } from './mocks/fetch-people';
import { useRef, useState } from 'react';

import { EventForm, type EventFormValues } from './features/event-form';
import { Timeline, type TimelineEvent } from './features/timeline';
import { generateTimelineEvents } from './mocks/generate-timeline-data';

function App() {
    const [events, setEvents] = useState<TimelineEvent[]>(() => generateTimelineEvents(200_000));

    // The form emits a draft without an id; App owns the id scheme (unique + sortable).
    const nextId = useRef(0);

    function addEvent(values: EventFormValues) {
        const event: TimelineEvent = { id: `new-${nextId.current++}`, ...values };
        setEvents((prev) => [event, ...prev]);
    }

    return (
        <section id="center">
            <EventForm onSave={addEvent} onCancel={() => {}} />
            <Timeline events={events} />
            {/* {
                false && <QueryBoundary
                status={status}
                error={error}
                onRetry={() => refetch()}
                loadingFallback={<DataGridSkeleton columns={personColumns} label="People" />}
            >
                <DataGrid<PersonRow>
                    columns={personColumns}
                    rows={data ?? []}
                    getRowKey={(row) => row.id}
                    label="People"
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    defaultRowsPerPage={10}
                />
            </QueryBoundary>
            } */}
        </section>
    );
}

export default App;
