import { useQuery } from '@tanstack/react-query';

import { DataGrid, DataGridSkeleton } from './features/data-grid';
import { QueryBoundary } from './components/query-boundary';
import { personColumns, type PersonRow } from './mocks/generate-grid-data';
import { fetchPeople } from './mocks/fetch-people';

function App() {
    // TODO: dev controls to toggle loading/empty/error states were removed for now — revisit
    // with a proper debug UI (see fetchPeople's `count` / `fail` params).
    const { status, data, error, refetch } = useQuery({
        queryKey: ['people'],
        queryFn: () => fetchPeople({ count: 100_000 }),
    });

    return (
        <section id="center">
            <QueryBoundary
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
        </section>
    );
}

export default App;
