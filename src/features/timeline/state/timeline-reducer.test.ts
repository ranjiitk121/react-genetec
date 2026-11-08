import { describe, expect, it } from 'vitest';

import { initTimelineState, timelineReducer, type TimelineState } from './timeline-reducer';

// Three days with 2, 1, and 3 events respectively — enough to exercise every boundary.
const SIZES = [2, 1, 3];

const makeState = (overrides?: Partial<TimelineState>): TimelineState =>
    initTimelineState(overrides);

const at = (groupIndex: number, itemIndex: number): TimelineState =>
    makeState({ focus: { groupIndex, itemIndex } });

describe('initTimelineState', () => {
    it('starts focus on the first item of the first group', () => {
        expect(makeState()).toEqual({ focus: { groupIndex: 0, itemIndex: 0 } });
    });

    it('applies overrides and returns a fresh object each call', () => {
        const a = makeState();
        const b = makeState();
        expect(a).not.toBe(b);
        expect(at(1, 0).focus).toEqual({ groupIndex: 1, itemIndex: 0 });
    });
});

describe('navigated — down / up within and across groups', () => {
    it('down moves to the next item in the same group', () => {
        const next = timelineReducer(at(0, 0), {
            type: 'navigated',
            direction: 'down',
            groupSizes: SIZES,
        });
        expect(next.focus).toEqual({ groupIndex: 0, itemIndex: 1 });
    });

    it('down past the last item flows into the next group', () => {
        const next = timelineReducer(at(0, 1), {
            type: 'navigated',
            direction: 'down',
            groupSizes: SIZES,
        });
        expect(next.focus).toEqual({ groupIndex: 1, itemIndex: 0 });
    });

    it('up before the first item flows into the previous group last item', () => {
        const next = timelineReducer(at(1, 0), {
            type: 'navigated',
            direction: 'up',
            groupSizes: SIZES,
        });
        expect(next.focus).toEqual({ groupIndex: 0, itemIndex: 1 });
    });
});

describe('navigated — left / right between groups', () => {
    it('right jumps to the next group first item', () => {
        const next = timelineReducer(at(0, 1), {
            type: 'navigated',
            direction: 'right',
            groupSizes: SIZES,
        });
        expect(next.focus).toEqual({ groupIndex: 1, itemIndex: 0 });
    });

    it('left jumps to the previous group first item', () => {
        const next = timelineReducer(at(2, 2), {
            type: 'navigated',
            direction: 'left',
            groupSizes: SIZES,
        });
        expect(next.focus).toEqual({ groupIndex: 1, itemIndex: 0 });
    });
});

describe('navigated — edges are no-ops that keep the same state reference', () => {
    it('up on the very first item does nothing', () => {
        const state = at(0, 0);
        expect(
            timelineReducer(state, { type: 'navigated', direction: 'up', groupSizes: SIZES }),
        ).toBe(state);
    });

    it('down on the very last item does nothing', () => {
        const state = at(2, 2);
        expect(
            timelineReducer(state, { type: 'navigated', direction: 'down', groupSizes: SIZES }),
        ).toBe(state);
    });

    it('left on the first group does nothing', () => {
        const state = at(0, 1);
        expect(
            timelineReducer(state, { type: 'navigated', direction: 'left', groupSizes: SIZES }),
        ).toBe(state);
    });

    it('right on the last group does nothing', () => {
        const state = at(2, 0);
        expect(
            timelineReducer(state, { type: 'navigated', direction: 'right', groupSizes: SIZES }),
        ).toBe(state);
    });
});

describe('focused — syncs the cursor to a directly-focused item', () => {
    it('moves focus to the reported position', () => {
        const next = timelineReducer(at(0, 0), {
            type: 'focused',
            position: { groupIndex: 2, itemIndex: 1 },
        });
        expect(next.focus).toEqual({ groupIndex: 2, itemIndex: 1 });
    });

    it('keeps the same reference when focus is already there (no re-render loop)', () => {
        const state = at(1, 0);
        expect(
            timelineReducer(state, { type: 'focused', position: { groupIndex: 1, itemIndex: 0 } }),
        ).toBe(state);
    });
});

describe('groupsChanged — clamps focus back into range', () => {
    it('pulls an out-of-range item back to the last valid one', () => {
        const next = timelineReducer(at(2, 2), { type: 'groupsChanged', groupSizes: [2, 1, 1] });
        expect(next.focus).toEqual({ groupIndex: 2, itemIndex: 0 });
    });

    it('resets to the first item when all data is gone', () => {
        const next = timelineReducer(at(2, 2), { type: 'groupsChanged', groupSizes: [] });
        expect(next.focus).toEqual({ groupIndex: 0, itemIndex: 0 });
    });

    it('keeps the same reference when focus is still valid', () => {
        const state = at(1, 0);
        expect(timelineReducer(state, { type: 'groupsChanged', groupSizes: SIZES })).toBe(state);
    });
});
