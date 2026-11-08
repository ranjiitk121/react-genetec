import type { EventStatus, TimelineEvent } from '../features/timeline';

export const timelineEvents: TimelineEvent[] = [
    { id: 'e1', date: '2025-12-15', status: 'completed', title: 'Beta Program' },
    { id: 'e2', date: '2025-12-15', status: 'started', title: 'Press Outreach' },
    { id: 'e3', date: '2025-11-01', status: 'completed', title: 'Usability Testing' },
    { id: 'e4', date: '2025-10-15', status: 'initiated', title: 'Design Phase' },
    { id: 'e5', date: '2025-10-15', status: 'completed', title: 'Wireframes' },
    { id: 'e6', date: '2025-10-15', status: 'started', title: 'User Interviews' },
    { id: 'e7', date: '2024-08-01', status: 'completed', title: 'Requirements Gathering' },
    { id: 'e8', date: '2024-07-15', status: 'started', title: 'Project Kickoff' },
];

const STATUSES: EventStatus[] = ['completed', 'initiated', 'started'];
const TITLES = [
    'Beta Program',
    'Usability Testing',
    'Design Phase',
    'Wireframes',
    'User Interviews',
    'Requirements Gathering',
    'Project Kickoff',
    'Security Audit',
    'Performance Pass',
    'Release Candidate',
];

// Format a Date to 'YYYY-MM-DD' using LOCAL parts (not toISOString, which is UTC and can slip a
// day). We generate and consume locally, so this stays consistent with groupEventsByDay's parser.
function isoDay(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Deterministic stress data: `count` events spread over consecutive days (1–4 per day), walking
// backwards from a fixed base date. Same count always yields the same events (stable renders).
export function generateTimelineEvents(count = 100_000): TimelineEvent[] {
    const base = new Date(2025, 11, 15); // local Dec 15 2025 — no string parsing, no timezone
    const events: TimelineEvent[] = [];

    for (let dayOffset = 0; events.length < count; dayOffset++) {
        const day = new Date(base);
        day.setDate(base.getDate() - dayOffset);
        const date = isoDay(day);

        const perDay = (dayOffset % 4) + 1; // 1..4 events on this day
        for (let k = 0; k < perDay && events.length < count; k++) {
            const i = events.length;
            events.push({
                id: `e${i}`,
                date,
                status: STATUSES[i % STATUSES.length],
                title: `${TITLES[i % TITLES.length]} #${i}`,
            });
        }
    }

    return events;
}
