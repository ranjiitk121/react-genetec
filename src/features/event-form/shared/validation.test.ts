import { describe, expect, it } from 'vitest';

import type { EventFormValues } from './types';
import { isValidDate, validate } from './validation';

const valid: EventFormValues = { title: 'Launch', date: '2025-12-15', status: 'initiated' };

describe('validate', () => {
    it('returns no errors for a valid draft', () => {
        expect(validate(valid)).toEqual({});
    });

    it('flags a missing title', () => {
        expect(validate({ ...valid, title: '' }).title).toBeDefined();
    });

    it('treats a whitespace-only title as missing', () => {
        expect(validate({ ...valid, title: '   ' }).title).toBeDefined();
    });

    it('flags an empty date', () => {
        expect(validate({ ...valid, date: '' }).date).toBeDefined();
    });

    it('flags an impossible calendar date', () => {
        expect(validate({ ...valid, date: '2025-02-30' }).date).toBeDefined();
    });

    it('can report both fields at once', () => {
        expect(validate({ ...valid, title: '', date: '' })).toEqual({
            title: expect.any(String),
            date: expect.any(String),
        });
    });
});

describe('isValidDate', () => {
    it('accepts a real date', () => {
        expect(isValidDate('2024-02-29')).toBe(true); // leap day
    });

    it('rejects a non-leap-year Feb 29', () => {
        expect(isValidDate('2025-02-29')).toBe(false);
    });

    it('rejects a malformed string', () => {
        expect(isValidDate('15/12/2025')).toBe(false);
    });

    it('rejects an empty string', () => {
        expect(isValidDate('')).toBe(false);
    });
});
