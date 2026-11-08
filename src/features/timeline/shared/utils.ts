import type { EventStatus, TimelineEvent, TimelineGroup } from './types';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function formatDayLabel(dayKey: string): string {
    const [year, month, day] = dayKey.split('-').map(Number);
    return `${MONTHS[month - 1]} ${day}, ${year}`;
}

export function groupEventsByDay(events: TimelineEvent[]): TimelineGroup[] {
    // One pass: drop each event into its day's bucket. A Map keeps it O(n).
    const byDay = new Map<string, TimelineEvent[]>();
    for (const event of events) {
        const bucket = byDay.get(event.date);
        if (bucket) {
            bucket.push(event);
        } else {
            byDay.set(event.date, [event]);
        }
    }

    // Turn the buckets into groups, then sort newest day first.
    const groups: TimelineGroup[] = [];
    for (const [dayKey, dayEvents] of byDay) {
        groups.push({ dayKey, label: formatDayLabel(dayKey), events: dayEvents });
    }
    groups.sort((a, b) => (a.dayKey < b.dayKey ? 1 : a.dayKey > b.dayKey ? -1 : 0));
    return groups;
}

// Status -> MUI palette colour. Record<> forces an entry for every status.
export const STATUS_COLOR_MAP: Record<EventStatus, string> = {
    completed: 'success.main', // green
    initiated: 'secondary.main', // purple
    started: 'error.main', // red
};
