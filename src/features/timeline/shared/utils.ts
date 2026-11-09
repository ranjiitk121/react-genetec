import type { Direction, EventStatus, FocusPosition, TimelineEvent, TimelineGroup } from './types';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function formatDayLabel(dayKey: string): string {
    const [year, month, day] = dayKey.split('-').map(Number);
    return `${MONTHS[month - 1]} ${day}, ${year}`;
}

export function groupEventsByDay(events: TimelineEvent[]): TimelineGroup[] {
    const byDay = new Map<string, TimelineEvent[]>();
    for (const event of events) {
        const bucket = byDay.get(event.date);
        if (bucket) {
            bucket.push(event);
        } else {
            byDay.set(event.date, [event]);
        }
    }

    const groups: TimelineGroup[] = [];
    for (const [dayKey, dayEvents] of byDay) {
        groups.push({ dayKey, label: formatDayLabel(dayKey), events: dayEvents });
    }
    groups.sort((a, b) => (a.dayKey < b.dayKey ? 1 : a.dayKey > b.dayKey ? -1 : 0)); // newest day first
    return groups;
}

function yieldToMain(): Promise<void> {
    const sched = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
    if (sched?.yield) return sched.yield();
    return new Promise((resolve) => setTimeout(resolve));
}

const GROUP_CHUNK = 10_000;

export async function groupEventsByDayAsync(
    events: TimelineEvent[],
    isCancelled: () => boolean,
): Promise<TimelineGroup[]> {
    const byDay = new Map<string, TimelineEvent[]>();
    for (let i = 0; i < events.length; i += GROUP_CHUNK) {
        const end = Math.min(i + GROUP_CHUNK, events.length);
        for (let j = i; j < end; j++) {
            const event = events[j];
            const bucket = byDay.get(event.date);
            if (bucket) {
                bucket.push(event);
            } else {
                byDay.set(event.date, [event]);
            }
        }
        if (end < events.length) {
            await yieldToMain();
            if (isCancelled()) return [];
        }
    }

    const groups: TimelineGroup[] = [];
    for (const [dayKey, dayEvents] of byDay) {
        groups.push({ dayKey, label: formatDayLabel(dayKey), events: dayEvents });
    }
    groups.sort((a, b) => (a.dayKey < b.dayKey ? 1 : a.dayKey > b.dayKey ? -1 : 0));
    return groups;
}

export const STATUS_COLOR_MAP: Record<EventStatus, 'success' | 'secondary' | 'error'> = {
    completed: 'success',
    initiated: 'secondary',
    started: 'error',
};

export function nextFocusPosition(
    groupSizes: number[],
    pos: FocusPosition,
    direction: Direction,
): FocusPosition {
    if (groupSizes.length === 0) return pos;
    const { groupIndex, itemIndex } = pos;
    const lastGroup = groupSizes.length - 1;

    switch (direction) {
        case 'up':
            if (itemIndex > 0) return { groupIndex, itemIndex: itemIndex - 1 };
            if (groupIndex > 0) {
                return { groupIndex: groupIndex - 1, itemIndex: groupSizes[groupIndex - 1] - 1 };
            }
            return pos;
        case 'down':
            if (itemIndex < groupSizes[groupIndex] - 1)
                return { groupIndex, itemIndex: itemIndex + 1 };
            if (groupIndex < lastGroup) return { groupIndex: groupIndex + 1, itemIndex: 0 };
            return pos;
        case 'left':
            if (groupIndex > 0) return { groupIndex: groupIndex - 1, itemIndex: 0 };
            return pos;
        case 'right':
            if (groupIndex < lastGroup) return { groupIndex: groupIndex + 1, itemIndex: 0 };
            return pos;
        default:
            return pos;
    }
}

// Pull a focus position back into range after the data changes; first item when there's nothing to land on.
export function clampFocus(groupSizes: number[], pos: FocusPosition): FocusPosition {
    if (groupSizes.length === 0) return { groupIndex: 0, itemIndex: 0 };
    const groupIndex = Math.min(Math.max(pos.groupIndex, 0), groupSizes.length - 1);
    const itemIndex = Math.min(Math.max(pos.itemIndex, 0), groupSizes[groupIndex] - 1);
    return { groupIndex, itemIndex };
}

export function eventAriaLabel(event: TimelineEvent): string {
    return `${event.title}, ${event.status}`;
}
