import type { EventFormValues, FormErrors } from './types';

export function validate(values: EventFormValues): FormErrors {
    const errors: FormErrors = {};

    if (values.title.trim() === '') {
        errors.title = 'Title is required.';
    }

    if (!isValidDate(values.date)) {
        errors.date = 'Enter a valid date.';
    }

    return errors;
}

//TODO: maybe better to well tested library instead of hand-rolled (if time allows)
export function isValidDate(value: string): boolean {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return false;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    // Reject overflow dates like 2025-02-30, which Date silently rolls into March.
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}
