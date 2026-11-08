export type EventStatus = 'initiated' | 'started' | 'completed';

export type EventFormValues = {
    title: string;
    date: string;
    status: EventStatus;
};

export type FormErrors = Partial<Record<'title' | 'date', string>>;
