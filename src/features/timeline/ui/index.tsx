import type { TimelineEvent } from '../shared/types';

type TimelineProps = {
    events: TimelineEvent[];
};

export function Timeline({ events }: TimelineProps) {
    return (
        <ul>
            {events.map((event) => (
                <li key={event.id}>
                    {event.date} — {event.status} {event.title}
                </li>
            ))}
        </ul>
    );
}
