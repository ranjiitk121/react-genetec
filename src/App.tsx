//import { useQuery } from '@tanstack/react-query';

// import { DataGrid, DataGridSkeleton } from './features/data-grid';
// import { QueryBoundary } from './components/query-boundary';
// import { personColumns, type PersonRow } from './mocks/generate-grid-data';
// import { fetchPeople } from './mocks/fetch-people';
import { useMemo } from 'react';

import { Timeline } from './features/timeline';
import { generateTimelineEvents } from './mocks/generate-timeline-data';

function App() {
    // Stress the virtualizer: 100k events built once (not per render).
    const events = useMemo(() => generateTimelineEvents(200_000), []);

    return (
        <section id="center">
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
