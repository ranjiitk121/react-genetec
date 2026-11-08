import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import type { EventStatus } from '../shared/types';

const STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
    { value: 'initiated', label: 'Initiated' },
    { value: 'started', label: 'Started' },
    { value: 'completed', label: 'Completed' },
];

export function EventForm() {
    return (
        <Box component="form">
            <Typography variant="h6">New Event</Typography>
            <Stack spacing={2}>
                <TextField label="Title" />
                <TextField label="Date" type="date" slotProps={{ inputLabel: { shrink: true } }} />
                <TextField label="Status" select defaultValue="initiated">
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
