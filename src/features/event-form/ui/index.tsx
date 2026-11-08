import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import type { EventStatus, EventFormValues } from '../shared/types';

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

    function updateField<K extends keyof EventFormValues>(field: K, value: EventFormValues[K]) {
        setDraft((prev) => ({ ...prev, [field]: value }));
    }

    return (
        <Box component="form">
            <Typography variant="h6">New Event</Typography>
            <Stack spacing={2}>
                <TextField
                    label="Title"
                    value={draft.title}
                    onChange={(event) => updateField('title', event.target.value)}
                />
                <TextField
                    label="Date"
                    type="date"
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={draft.date}
                    onChange={(event) => updateField('date', event.target.value)}
                />
                <TextField
                    label="Status"
                    select
                    value={draft.status}
                    onChange={(event) => {
                        if (isEventStatus(event.target.value)) {
                            updateField('status', event.target.value);
                        }
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
                <Button>Cancel</Button>
                <Button variant="contained">Save</Button>
            </Stack>
        </Box>
    );
}
