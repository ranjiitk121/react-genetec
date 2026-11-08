export type EventStatus = 'completed' | 'initiated' | 'started';

export type TimelineEvent = {
    id: string;
    date: string; // ISO day, 'YYYY-MM-DD'
    status: EventStatus;
    title: string;
};

export type TimelineGroup = {
    dayKey: string; // 'YYYY-MM-DD' — stable key we bucket/compare on
    label: string; // 'DEC 15, 2025' — the human-facing header
    events: TimelineEvent[];
};

export type FocusPosition = { groupIndex: number; itemIndex: number };

export type Direction = 'up' | 'down' | 'left' | 'right';
