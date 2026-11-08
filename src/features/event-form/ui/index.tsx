import { useRef, useState, type SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import type { EventStatus, EventFormValues, FormErrors } from '../shared/types';
import { validate } from '../shared/validation';

const FIELD_ORDER: (keyof FormErrors)[] = ['title', 'date'];

const STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
    { value: 'initiated', label: 'Initiated' },
    { value: 'started', label: 'Started' },
    { value: 'completed', label: 'Completed' },
];

const EMPTY_DRAFT: EventFormValues = { title: '', date: '', status: 'initiated' };

function isEventStatus(value: string): value is EventStatus {
    return STATUS_OPTIONS.some((option) => option.value === value);
}

export function EventForm() {
    const [draft, setDraft] = useState<EventFormValues>(EMPTY_DRAFT);
    const [errors, setErrors] = useState<FormErrors>({});

    const titleRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const fieldRefs = { title: titleRef, date: dateRef };

    function updateField<K extends keyof EventFormValues>(field: K, value: EventFormValues[K]) {
        setDraft((prev) => ({ ...prev, [field]: value }));
    }

    function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        const nextErrors = validate(draft);
        setErrors(nextErrors);

        const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
        if (firstInvalid) {
            fieldRefs[firstInvalid].current?.focus();
            return;
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h6">New Event</Typography>
            <Stack spacing={2}>
                <TextField
                    label="Title"
                    inputRef={titleRef}
                    value={draft.title}
                    onChange={(event) => updateField('title', event.target.value)}
                    error={Boolean(errors.title)}
                    helperText={errors.title}
                />
                <TextField
                    label="Date"
                    type="date"
                    inputRef={dateRef}
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={draft.date}
                    onChange={(event) => updateField('date', event.target.value)}
                    error={Boolean(errors.date)}
                    helperText={errors.date}
                />
                <TextField
                    label="Status"
                    select
                    value={draft.status}
                    onChange={(event) => {
                        if (isEventStatus(event.target.value)) {
                            updateField('status', event.target.value);
                        }
                        //TODO: handle this, (it cannot happen but still)
                    }}
                >
                    {STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Stack>
            <Stack direction="row" spacing={1}>
                <Button type="button">Cancel</Button>
                <Button type="submit" variant="contained">
                    Save
                </Button>
            </Stack>
        </Box>
    );
}
