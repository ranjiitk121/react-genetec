import { describe, expect, it } from 'vitest';

import { fetchPeople } from './fetch-people';

// delayMs: 0 keeps these fast — we're testing resolve/reject/empty behavior, not timing.
describe('fetchPeople', () => {
    it('resolves the requested number of rows', async () => {
        const rows = await fetchPeople({ count: 5, delayMs: 0 });
        expect(rows).toHaveLength(5);
        expect(rows[0]).toMatchObject({ id: 1 });
    });

    it('returns an empty array for count 0 (empty state)', async () => {
        const rows = await fetchPeople({ count: 0, delayMs: 0 });
        expect(rows).toEqual([]);
    });

    it('rejects when fail is set (error state)', async () => {
        await expect(fetchPeople({ fail: true, delayMs: 0 })).rejects.toThrow(/simulated/i);
    });
});
