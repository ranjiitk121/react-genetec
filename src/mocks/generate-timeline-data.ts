import type { TimelineEvent } from '../features/timeline';

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
