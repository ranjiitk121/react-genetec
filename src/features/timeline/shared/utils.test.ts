import { describe, expect, it } from 'vitest';

import { eventAriaLabel, groupEventsByDay } from './utils';
import type { TimelineEvent } from './types';

const event = (id: string, date: string, title: string): TimelineEvent => ({
    id,
    date,
    title,
    status: 'completed',
});

describe('groupEventsByDay', () => {
    it('buckets events by day and sorts newest day first', () => {
        const groups = groupEventsByDay([
            event('a', '2025-12-14', 'A'),
            event('b', '2025-12-15', 'B'),
            event('c', '2025-12-14', 'C'),
        ]);
        expect(groups.map((g) => g.dayKey)).toEqual(['2025-12-15', '2025-12-14']);
        expect(groups[1].events.map((e) => e.id)).toEqual(['a', 'c']);
    });

    it('formats the human-facing label', () => {
        const [group] = groupEventsByDay([event('a', '2025-12-15', 'A')]);
        expect(group.label).toBe('DEC 15, 2025');
    });
});

describe('event label helper', () => {
    it('builds a concise accessible name', () => {
        expect(eventAriaLabel(event('a', '2025-12-15', 'Deploy'))).toBe('Deploy, completed');
    });
});
