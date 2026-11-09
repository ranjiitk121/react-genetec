import type { EventFormValues, EventStatus, FormErrors } from './types';

export const STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
    { value: 'initiated', label: 'Initiated' },
    { value: 'started', label: 'Started' },
    { value: 'completed', label: 'Completed' },
];

// Validated fields in focus order — the first invalid one gets focus on submit.
export const FIELD_ORDER: (keyof FormErrors)[] = ['title', 'date'];

export function todayIso(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function emptyDraft(): EventFormValues {
    return { title: '', date: todayIso(), status: 'initiated' };
}

export function isEventStatus(value: string): value is EventStatus {
    return STATUS_OPTIONS.some((option) => option.value === value);
}
