import { describe, expect, it } from 'vitest';

import type { Column } from '../shared/types';
import type { Overlay } from './grid-reducer';
import { selectOverlay } from './grid-selectors';

type Row = { id: string };
const columns: Column<Row>[] = [
    { id: 'name', label: 'Name', accessor: (r) => r.id },
    { id: 'age', label: 'Age', accessor: () => 0 },
];
const anchor = {} as HTMLElement;

describe('selectOverlay', () => {
    it('reports nothing open when kind is none', () => {
        const view = selectOverlay({ kind: 'none' }, columns);
        expect(view).toMatchObject({
            isActionsOpen: false,
            isManageOpen: false,
            isFilterOpen: false,
            actionsAnchorEl: null,
            filterAnchorEl: null,
            manageAnchorEl: null,
            activeActionsColumnId: null,
            filterColumnId: null,
            filterColumn: null,
        });
    });

    it('exposes the actions anchor + active column for an actions overlay', () => {
        const overlay: Overlay = { kind: 'actions', anchorEl: anchor, columnId: 'age' };
        const view = selectOverlay(overlay, columns);
        expect(view.isActionsOpen).toBe(true);
        expect(view.actionsAnchorEl).toBe(anchor);
        expect(view.activeActionsColumnId).toBe('age');
        expect(view.isFilterOpen).toBe(false);
    });

    it('resolves the filter column for a filter overlay', () => {
        const overlay: Overlay = { kind: 'filter', anchorEl: anchor, columnId: 'name' };
        const view = selectOverlay(overlay, columns);
        expect(view.isFilterOpen).toBe(true);
        expect(view.filterAnchorEl).toBe(anchor);
        expect(view.filterColumnId).toBe('name');
        expect(view.filterColumn).toBe(columns[0]);
    });

    it('exposes only the manage anchor for a manage overlay', () => {
        const view = selectOverlay({ kind: 'manage', anchorEl: anchor }, columns);
        expect(view.isManageOpen).toBe(true);
        expect(view.manageAnchorEl).toBe(anchor);
        expect(view.activeActionsColumnId).toBe(null);
        expect(view.filterColumn).toBe(null);
    });
});
