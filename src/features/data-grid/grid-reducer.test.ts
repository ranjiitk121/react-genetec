import { describe, expect, it } from 'vitest';

import { gridReducer, initGridState, type GridAction, type GridState } from './grid-reducer';

/**
 * The reducer is pure and non-generic, so these tests need no React and no DOM.
 * `anchorEl` is only ever stored (never dereferenced) by the reducer, so a plain
 * object cast to HTMLElement is a sufficient stand-in for a real DOM node.
 */
const anchor = (tag: string) => ({ tag }) as unknown as HTMLElement;
const A = anchor('a');
const B = anchor('b');

/** Build a state in the `actions` overlay, which several transitions depend on. */
const withActionsOverlay = (columnId = 'name', anchorEl = A): GridState =>
    initGridState({ overlay: { kind: 'actions', anchorEl, columnId } });

describe('initGridState', () => {
    it('returns sensible defaults', () => {
        expect(initGridState()).toEqual({
            sort: null,
            filters: {},
            visibility: {},
            page: 0,
            rowsPerPage: 15,
            overlay: { kind: 'none' },
        });
    });

    it('applies overrides on top of the defaults', () => {
        const state = initGridState({ page: 3, rowsPerPage: 50 });
        expect(state.page).toBe(3);
        expect(state.rowsPerPage).toBe(50);
        expect(state.sort).toBeNull();
    });

    it('produces a fresh object each call (no shared references)', () => {
        const a = initGridState();
        const b = initGridState();
        expect(a).not.toBe(b);
        expect(a.filters).not.toBe(b.filters);
    });
});

describe('sorting — headerClicked', () => {
    it('sorts a previously-unsorted column ascending', () => {
        const next = gridReducer(initGridState(), { type: 'headerClicked', columnId: 'name' });
        expect(next.sort).toEqual({ columnId: 'name', direction: 'asc' });
    });

    it('toggles asc → desc on the same column', () => {
        const state = initGridState({ sort: { columnId: 'name', direction: 'asc' } });
        const next = gridReducer(state, { type: 'headerClicked', columnId: 'name' });
        expect(next.sort).toEqual({ columnId: 'name', direction: 'desc' });
    });

    it('toggles desc → asc on the same column', () => {
        const state = initGridState({ sort: { columnId: 'name', direction: 'desc' } });
        const next = gridReducer(state, { type: 'headerClicked', columnId: 'name' });
        expect(next.sort).toEqual({ columnId: 'name', direction: 'asc' });
    });

    it('resets to ascending when switching to a different column', () => {
        const state = initGridState({ sort: { columnId: 'name', direction: 'desc' } });
        const next = gridReducer(state, { type: 'headerClicked', columnId: 'age' });
        expect(next.sort).toEqual({ columnId: 'age', direction: 'asc' });
    });

    it('does not touch unrelated fields', () => {
        const state = initGridState({ page: 4, filters: { name: 'x' } });
        const next = gridReducer(state, { type: 'headerClicked', columnId: 'name' });
        expect(next.page).toBe(4);
        expect(next.filters).toEqual({ name: 'x' });
    });
});

describe('sorting — sortSelected (from the actions menu)', () => {
    it('sets the chosen direction on the overlay column and closes the overlay', () => {
        const next = gridReducer(withActionsOverlay('age'), {
            type: 'sortSelected',
            direction: 'desc',
        });
        expect(next.sort).toEqual({ columnId: 'age', direction: 'desc' });
        expect(next.overlay).toEqual({ kind: 'none' });
    });

    it('is a no-op (same reference) when no actions menu is open', () => {
        const state = initGridState();
        const next = gridReducer(state, { type: 'sortSelected', direction: 'asc' });
        expect(next).toBe(state);
    });

    it('is a no-op when a different overlay (filter) is open', () => {
        const state = initGridState({ overlay: { kind: 'filter', anchorEl: A, columnId: 'name' } });
        const next = gridReducer(state, { type: 'sortSelected', direction: 'asc' });
        expect(next).toBe(state);
    });
});

describe('filtering — filterChanged', () => {
    it('sets a column filter value', () => {
        const next = gridReducer(initGridState(), {
            type: 'filterChanged',
            columnId: 'name',
            value: 'ab',
        });
        expect(next.filters).toEqual({ name: 'ab' });
    });

    it('always resets to the first page', () => {
        const state = initGridState({ page: 7 });
        const next = gridReducer(state, { type: 'filterChanged', columnId: 'name', value: 'ab' });
        expect(next.page).toBe(0);
    });

    it('merges with existing filters rather than replacing them', () => {
        const state = initGridState({ filters: { age: '30' } });
        const next = gridReducer(state, { type: 'filterChanged', columnId: 'name', value: 'ab' });
        expect(next.filters).toEqual({ age: '30', name: 'ab' });
    });

    it('treats clearing (empty value) as a normal change that resets the page', () => {
        const state = initGridState({ page: 3, filters: { name: 'ab' } });
        const next = gridReducer(state, { type: 'filterChanged', columnId: 'name', value: '' });
        expect(next.filters).toEqual({ name: '' });
        expect(next.page).toBe(0);
    });

    it('leaves the overlay open while typing', () => {
        const state = initGridState({ overlay: { kind: 'filter', anchorEl: A, columnId: 'name' } });
        const next = gridReducer(state, { type: 'filterChanged', columnId: 'name', value: 'x' });
        expect(next.overlay).toEqual({ kind: 'filter', anchorEl: A, columnId: 'name' });
    });
});

describe('pagination', () => {
    it('pageChanged sets the page', () => {
        const next = gridReducer(initGridState(), { type: 'pageChanged', page: 5 });
        expect(next.page).toBe(5);
    });

    it('rowsPerPageChanged sets the size and resets the page', () => {
        const state = initGridState({ page: 9 });
        const next = gridReducer(state, { type: 'rowsPerPageChanged', rowsPerPage: 25 });
        expect(next.rowsPerPage).toBe(25);
        expect(next.page).toBe(0);
    });
});

describe('column visibility', () => {
    it('toggles a column with no override and no default hidden (visible → hidden)', () => {
        const next = gridReducer(initGridState(), { type: 'columnToggled', columnId: 'name' });
        expect(next.visibility).toEqual({ name: false });
    });

    it('respects a default-hidden column (hidden → visible)', () => {
        const next = gridReducer(initGridState(), {
            type: 'columnToggled',
            columnId: 'secret',
            hidden: true,
        });
        expect(next.visibility).toEqual({ secret: true });
    });

    it('toggles against an existing override', () => {
        const state = initGridState({ visibility: { name: false } });
        const next = gridReducer(state, { type: 'columnToggled', columnId: 'name' });
        expect(next.visibility).toEqual({ name: true });
    });

    it('merges the toggle with other columns overrides', () => {
        const state = initGridState({ visibility: { age: false } });
        const next = gridReducer(state, { type: 'columnToggled', columnId: 'name' });
        expect(next.visibility).toEqual({ age: false, name: false });
    });

    it('allColumnsVisibilitySet sets every given id and replaces the map', () => {
        const state = initGridState({ visibility: { stale: true } });
        const next = gridReducer(state, {
            type: 'allColumnsVisibilitySet',
            columnIds: ['name', 'age'],
            visible: false,
        });
        expect(next.visibility).toEqual({ name: false, age: false });
    });

    it('columnVisibilityReset clears all overrides', () => {
        const state = initGridState({ visibility: { name: false, age: true } });
        const next = gridReducer(state, { type: 'columnVisibilityReset' });
        expect(next.visibility).toEqual({});
    });
});

describe('overlay state machine', () => {
    it('actionsMenuOpened opens the actions overlay anchored to a column', () => {
        const next = gridReducer(initGridState(), {
            type: 'actionsMenuOpened',
            anchorEl: A,
            columnId: 'name',
        });
        expect(next.overlay).toEqual({ kind: 'actions', anchorEl: A, columnId: 'name' });
    });

    it('filterOpenedFromHeader opens the filter overlay from any starting overlay', () => {
        const next = gridReducer(withActionsOverlay('age', A), {
            type: 'filterOpenedFromHeader',
            anchorEl: B,
            columnId: 'name',
        });
        expect(next.overlay).toEqual({ kind: 'filter', anchorEl: B, columnId: 'name' });
    });

    it('filterOpenedFromMenu reuses the actions menu anchor + column', () => {
        const next = gridReducer(withActionsOverlay('age', A), { type: 'filterOpenedFromMenu' });
        expect(next.overlay).toEqual({ kind: 'filter', anchorEl: A, columnId: 'age' });
    });

    it('filterOpenedFromMenu is a no-op when the actions menu is not open', () => {
        const state = initGridState();
        expect(gridReducer(state, { type: 'filterOpenedFromMenu' })).toBe(state);
    });

    it('manageOpened reuses the actions menu anchor', () => {
        const next = gridReducer(withActionsOverlay('age', A), { type: 'manageOpened' });
        expect(next.overlay).toEqual({ kind: 'manage', anchorEl: A });
    });

    it('manageOpened is a no-op when the actions menu is not open', () => {
        const state = initGridState({ overlay: { kind: 'filter', anchorEl: A, columnId: 'name' } });
        expect(gridReducer(state, { type: 'manageOpened' })).toBe(state);
    });

    it('overlayClosed returns to the none state', () => {
        const next = gridReducer(withActionsOverlay(), { type: 'overlayClosed' });
        expect(next.overlay).toEqual({ kind: 'none' });
    });

    it('can never represent two overlays at once across a realistic sequence', () => {
        const actions: GridAction[] = [
            { type: 'actionsMenuOpened', anchorEl: A, columnId: 'name' },
            { type: 'filterOpenedFromMenu' },
            { type: 'filterChanged', columnId: 'name', value: 'x' },
            { type: 'overlayClosed' },
            { type: 'filterOpenedFromHeader', anchorEl: B, columnId: 'age' },
        ];
        let state = initGridState();
        for (const action of actions) {
            state = gridReducer(state, action);
            // `overlay` is a single union value — there is structurally only ever one kind.
            expect(['none', 'actions', 'filter', 'manage']).toContain(state.overlay.kind);
        }
        expect(state.overlay).toEqual({ kind: 'filter', anchorEl: B, columnId: 'age' });
    });
});

describe('reducer invariants', () => {
    it('never mutates the input state', () => {
        const state = initGridState({ page: 2, filters: { name: 'a' } });
        const snapshot = structuredClone(state);
        gridReducer(state, { type: 'filterChanged', columnId: 'name', value: 'ab' });
        gridReducer(state, { type: 'pageChanged', page: 9 });
        gridReducer(state, { type: 'columnToggled', columnId: 'name' });
        expect(state).toEqual(snapshot);
    });

    it('returns a new object reference for real changes', () => {
        const state = initGridState();
        const next = gridReducer(state, { type: 'pageChanged', page: 1 });
        expect(next).not.toBe(state);
    });

    it('returns the same reference for an unknown action', () => {
        const state = initGridState();
        // Exercising the default branch — cast through unknown since it is off-type.
        const next = gridReducer(state, { type: 'nope' } as unknown as GridAction);
        expect(next).toBe(state);
    });
});
