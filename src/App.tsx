import { DataGrid } from './features/data-grid';
import { generateGridData, type PersonRow } from './mocks/generate-grid-data';

const { columns, rows } = generateGridData(50);

function App() {
    return (
        <>
            <section id="center">
                <DataGrid<PersonRow>
                    columns={columns}
                    rows={rows}
                    getRowKey={(row) => row.id}
                    label="People"
                />
            </section>
        </>
    );
}

export default App;
