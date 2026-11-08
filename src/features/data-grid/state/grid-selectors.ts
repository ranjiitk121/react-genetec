// Pure *reads* of the reducer's state. The reducer writes `GridState`; selectors turn it into
// the flat shape the UI needs. Lives next to the reducer (not in shared/) because it depends on
// the reducer's `Overlay` type.

import type { Column } from '../shared/types';
import type { Overlay } from './grid-reducer';

/**
 * Unpack the mutually-exclusive `Overlay` union into the flat anchors/flags the JSX binds to.
 * Everything is DERIVED from `overlay` — there is no separate "is open" state to keep in sync.
 */
export function selectOverlay<TRow>(overlay: Overlay, columns: Column<TRow>[]) {
    const filterColumnId = overlay.kind === 'filter' ? overlay.columnId : null;
    return {
        actionsAnchorEl: overlay.kind === 'actions' ? overlay.anchorEl : null,
        filterAnchorEl: overlay.kind === 'filter' ? overlay.anchorEl : null,
        manageAnchorEl: overlay.kind === 'manage' ? overlay.anchorEl : null,
        activeActionsColumnId: overlay.kind === 'actions' ? overlay.columnId : null,
        filterColumn: columns.find((c) => c.id === filterColumnId) ?? null,
        filterColumnId,
        isActionsOpen: overlay.kind === 'actions',
        isManageOpen: overlay.kind === 'manage',
        isFilterOpen: overlay.kind === 'filter',
    };
}
