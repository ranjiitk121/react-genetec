import { useRef, useState, type ReactNode, type SyntheticEvent } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineRounded';

import type { EventStatus, EventFormValues, FormErrors } from '../shared/types';
import { validate } from '../shared/validation';

const FIELD_ORDER: (keyof FormErrors)[] = ['title', 'date'];

const STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
    { value: 'initiated', label: 'Initiated' },
    { value: 'started', label: 'Started' },
    { value: 'completed', label: 'Completed' },
];

function todayIso(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function emptyDraft(): EventFormValues {
    return { title: '', date: todayIso(), status: 'initiated' };
}

function isEventStatus(value: string): value is EventStatus {
    return STATUS_OPTIONS.some((option) => option.value === value);
}

function Field({
    id,
    label,
    required,
    error,
    hint,
    children,
}: {
    id: string;
    label: string;
    required?: boolean;
    error?: string;
    hint?: string;
    children: ReactNode;
}) {
    return (
        <FormControl fullWidth error={Boolean(error)}>
            <FormLabel
                htmlFor={id}
                sx={{ mb: 0.75, fontSize: 13, fontWeight: 500, color: 'text.primary' }}
            >
                {label}
                {required && (
                    <Box component="span" aria-hidden="true" sx={{ color: 'error.main', ml: 0.25 }}>
                        *
                    </Box>
                )}
            </FormLabel>
            {children}
            {error ? (
                <FormHelperText
                    sx={{ mx: 0, mt: 0.75, display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                    <ErrorOutlineIcon sx={{ fontSize: 14 }} />
                    {error}
                </FormHelperText>
            ) : (
                hint && <FormHelperText sx={{ mx: 0, mt: 0.75 }}>{hint}</FormHelperText>
            )}
        </FormControl>
    );
}

type EventFormProps = {
    open: boolean;
    onSave: (values: EventFormValues) => void;
    onClose: () => void;
    initialValues?: EventFormValues;
};

export function EventForm({ open, onSave, onClose, initialValues }: EventFormProps) {
    const isEdit = initialValues !== undefined;

    // App remounts this component (via `key`) each time the dialog opens, so these initializers
    // give a fresh draft every open — no reset effect needed.
    const [draft, setDraft] = useState<EventFormValues>(initialValues ?? emptyDraft);
    const [errors, setErrors] = useState<FormErrors>({});

    const titleRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const fieldRefs = { title: titleRef, date: dateRef };

    function updateField<K extends keyof EventFormValues>(field: K, value: EventFormValues[K]) {
        setDraft((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) =>
            prev[field as keyof FormErrors] ? { ...prev, [field]: undefined } : prev,
        );
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

        onSave(draft);
    }

    function changeStatus(event: SelectChangeEvent) {
        if (isEventStatus(event.target.value)) {
            updateField('status', event.target.value);
        }
    }

    const errorCount = FIELD_ORDER.filter((field) => errors[field]).length;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            aria-labelledby="event-form-title"
            slotProps={{ transition: { onEntered: () => titleRef.current?.focus() } }}
        >
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogTitle
                    id="event-form-title"
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <Typography variant="h6" component="span">
                        {isEdit ? 'Edit event' : 'New event'}
                    </Typography>
                    <IconButton
                        aria-label="Close"
                        onClick={onClose}
                        sx={{ color: 'text.secondary' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2.5} sx={{ pt: 1 }}>
                        {errorCount > 0 && (
                            <Alert severity="error">
                                {errorCount} {errorCount === 1 ? 'field needs' : 'fields need'}{' '}
                                attention.
                            </Alert>
                        )}

                        <Field id="ef-title" label="Title" required error={errors.title}>
                            <OutlinedInput
                                id="ef-title"
                                size="small"
                                inputRef={titleRef}
                                value={draft.title}
                                onChange={(event) => updateField('title', event.target.value)}
                                placeholder="e.g. Deploy API gateway"
                            />
                        </Field>

                        <Field
                            id="ef-date"
                            label="Date"
                            required
                            error={errors.date}
                            hint="Defaults to today"
                        >
                            <OutlinedInput
                                id="ef-date"
                                type="date"
                                size="small"
                                inputRef={dateRef}
                                value={draft.date}
                                onChange={(event) => updateField('date', event.target.value)}
                            />
                        </Field>

                        <FormControl fullWidth>
                            <FormLabel
                                id="ef-status-label"
                                sx={{
                                    mb: 0.75,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: 'text.primary',
                                }}
                            >
                                Status
                            </FormLabel>
                            <Select
                                labelId="ef-status-label"
                                size="small"
                                value={draft.status}
                                onChange={changeStatus}
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>

                <DialogActions
                    sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider', bgcolor: '#FAFBFC' }}
                >
                    <Button type="button" variant="outlined" color="inherit" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                        {isEdit ? 'Save changes' : 'Save event'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
