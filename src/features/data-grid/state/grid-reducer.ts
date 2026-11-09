// The DataGrid's view-state as an event-driven reducer. Design rationale in NOTES.md.

import { resolveVisibility } from '../shared/utils';
import type { FilterState, SortDirection, SortState, VisibilityState } from '../shared/types';

// The single mutually-exclusive overlay — only one menu/popover can be open.
export type Overlay =
    | { kind: 'none' }
    | { kind: 'actions'; anchorEl: HTMLElement; columnId: string }
    | { kind: 'filter'; anchorEl: HTMLElement; columnId: string }
    | { kind: 'manage'; anchorEl: HTMLElement };

export type GridState = {
    sort: SortState;
    filters: FilterState;
    visibility: VisibilityState;
    page: number;
    rowsPerPage: number;
    overlay: Overlay;
};

// Actions are named after the user/business event that occurred, not the field.
export type GridAction =
    // sorting
    | { type: 'headerClicked'; columnId: string }
    | { type: 'sortSelected'; direction: SortDirection }
    // filtering
    | { type: 'filterChanged'; columnId: string; value: string }
    // pagination
    | { type: 'pageChanged'; page: number }
    | { type: 'rowsPerPageChanged'; rowsPerPage: number }
    // column visibility
    | { type: 'columnToggled'; columnId: string; hidden?: boolean }
    | { type: 'columnVisibilityReset' }
    // overlays (menus / popovers)
    | { type: 'actionsMenuOpened'; anchorEl: HTMLElement; columnId: string }
    | { type: 'filterOpenedFromHeader'; anchorEl: HTMLElement; columnId: string }
    | { type: 'filterOpenedFromMenu' }
    | { type: 'manageOpened'; anchorEl: HTMLElement }
    | { type: 'overlayClosed' };

export function initGridState(rowsPerPage: number, overrides?: Partial<GridState>): GridState {
    return {
        sort: null,
        filters: {},
        visibility: {},
        page: 0,
        rowsPerPage,
        overlay: { kind: 'none' },
        ...overrides,
    };
}

export function gridReducer(state: GridState, action: GridAction): GridState {
    switch (action.type) {
        case 'headerClicked': {
            const { sort } = state;

            if (!sort || sort.columnId !== action.columnId) {
                return { ...state, sort: { columnId: action.columnId, direction: 'asc' } };
            }
            if (sort.direction === 'asc') {
                return { ...state, sort: { columnId: action.columnId, direction: 'desc' } };
            }
            return { ...state, sort: null };
        }

        case 'sortSelected': {
            if (state.overlay.kind !== 'actions') return state;
            return {
                ...state,
                sort: { columnId: state.overlay.columnId, direction: action.direction },
                overlay: { kind: 'none' },
            };
        }

        case 'filterChanged':
            return {
                ...state,
                filters: { ...state.filters, [action.columnId]: action.value },
                page: 0, // filtering shrinks the list — jump back to the first page
            };

        case 'pageChanged':
            return { ...state, page: action.page };

        case 'rowsPerPageChanged':
            return { ...state, rowsPerPage: action.rowsPerPage, page: 0 };

        case 'columnToggled': {
            const nextVisible = !resolveVisibility(
                state.visibility,
                action.columnId,
                action.hidden,
            );
            return {
                ...state,
                visibility: { ...state.visibility, [action.columnId]: nextVisible },
            };
        }

        case 'columnVisibilityReset':
            return { ...state, visibility: {} };

        case 'actionsMenuOpened':
            return {
                ...state,
                overlay: { kind: 'actions', anchorEl: action.anchorEl, columnId: action.columnId },
            };

        case 'filterOpenedFromHeader':
            return {
                ...state,
                overlay: { kind: 'filter', anchorEl: action.anchorEl, columnId: action.columnId },
            };

        case 'filterOpenedFromMenu': {
            if (state.overlay.kind !== 'actions') return state;
            return {
                ...state,
                overlay: {
                    kind: 'filter',
                    anchorEl: state.overlay.anchorEl,
                    columnId: state.overlay.columnId,
                },
            };
        }

        case 'manageOpened':
            // Anchored to the toolbar button, not a column header, so hiding a column can't unmount it.
            return { ...state, overlay: { kind: 'manage', anchorEl: action.anchorEl } };

        case 'overlayClosed':
            return { ...state, overlay: { kind: 'none' } };

        default:
            return state;
    }
}
