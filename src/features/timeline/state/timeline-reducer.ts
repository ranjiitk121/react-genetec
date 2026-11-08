import type { Direction, FocusPosition } from '../shared/types';
import { clampFocus, nextFocusPosition } from '../shared/utils';

export type TimelineState = {
    focus: FocusPosition;
};

export type TimelineAction =
    | { type: 'navigated'; direction: Direction; groupSizes: number[] }
    | { type: 'focused'; position: FocusPosition } // DOM focus landed on an item (click or Tab)
    | { type: 'groupsChanged'; groupSizes: number[] };

export function initTimelineState(overrides?: Partial<TimelineState>): TimelineState {
    return { focus: { groupIndex: 0, itemIndex: 0 }, ...overrides };
}

const samePosition = (a: FocusPosition, b: FocusPosition) =>
    a.groupIndex === b.groupIndex && a.itemIndex === b.itemIndex;

// Each case returns the same state reference on a no-op so React skips the re-render.
export function timelineReducer(state: TimelineState, action: TimelineAction): TimelineState {
    switch (action.type) {
        case 'navigated': {
            const focus = nextFocusPosition(action.groupSizes, state.focus, action.direction);
            return samePosition(focus, state.focus) ? state : { ...state, focus };
        }
        case 'focused':
            return samePosition(action.position, state.focus)
                ? state
                : { ...state, focus: action.position };
        case 'groupsChanged': {
            const focus = clampFocus(action.groupSizes, state.focus);
            return samePosition(focus, state.focus) ? state : { ...state, focus };
        }
        default:
            return state;
    }
}
