// A FAKE async "API" for the DataGrid demo. The rows are still generated locally
// (see generate-grid-data.ts) — this just wraps them in a Promise with artificial
// latency and an injectable failure, so the grid has a real loading → success / error
// lifecycle to render. Consumed via TanStack Query in App.tsx.

import { generateRows, type PersonRow } from './generate-grid-data';

export type FetchPeopleParams = {
    /** How many rows to "return". `0` exercises the empty state. */
    count?: number;
    /** When true the request rejects — exercises the error state. */
    fail?: boolean;
    /** Artificial latency in ms, so the loading state is observable. */
    delayMs?: number;
};

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function fetchPeople(params?: FetchPeopleParams): Promise<PersonRow[]> {
    const { count = 100_000, fail = false, delayMs = 600 } = params ?? {};
    await delay(delayMs);
    if (fail) {
        throw new Error('Failed to load people (simulated).');
    }
    return generateRows(count);
}
