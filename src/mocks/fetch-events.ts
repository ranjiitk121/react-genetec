import type { TimelineEvent } from '../features/timeline';
import { generateTimelineEvents } from './generate-timeline-data';

export type FetchEventsParams = {
    count?: number;
    fail?: boolean;
    delayMs?: number;
};

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function fetchEvents(params?: FetchEventsParams): Promise<TimelineEvent[]> {
    const { count = 200_000, fail = false, delayMs = 600 } = params ?? {};
    await delay(delayMs);
    if (fail) {
        throw new Error('Failed to load events (simulated).');
    }
    return generateTimelineEvents(count);
}
