import { useRef, useState, type SyntheticEvent } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

import type { EventFormValues, FormErrors } from '../shared/types';
import { emptyDraft, FIELD_ORDER } from '../shared/utils';
import { validate } from '../shared/validation';
import { EventFormActions } from './event-form-actions';
import { EventFormHeader } from './event-form-header';
import { FormField } from './form-field';
import { contentStackSx } from './index.styles';
import { StatusSelect } from './status-select';

type EventFormProps = {
    open: boolean;
    onSave: (values: EventFormValues) => void;
    onClose: () => void;
    initialValues?: EventFormValues;
};

export function EventForm({ open, onSave, onClose, initialValues }: EventFormProps) {
    const isEdit = initialValues !== undefined;
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
                <EventFormHeader title={isEdit ? 'Edit event' : 'New event'} onClose={onClose} />

                <DialogContent>
                    <Stack spacing={2.5} sx={contentStackSx}>
                        {errorCount > 0 && (
                            <Alert severity="error">
                                {errorCount} {errorCount === 1 ? 'field needs' : 'fields need'}{' '}
                                attention.
                            </Alert>
                        )}

                        <FormField id="ef-title" label="Title" required error={errors.title}>
                            {(field) => (
                                <OutlinedInput
                                    {...field}
                                    size="small"
                                    inputRef={titleRef}
                                    value={draft.title}
                                    onChange={(event) => updateField('title', event.target.value)}
                                    placeholder="e.g. Deploy API gateway"
                                />
                            )}
                        </FormField>

                        <FormField
                            id="ef-date"
                            label="Date"
                            required
                            error={errors.date}
                            hint="Defaults to today"
                        >
                            {(field) => (
                                <OutlinedInput
                                    {...field}
                                    type="date"
                                    size="small"
                                    inputRef={dateRef}
                                    value={draft.date}
                                    onChange={(event) => updateField('date', event.target.value)}
                                />
                            )}
                        </FormField>

                        <StatusSelect
                            value={draft.status}
                            onChange={(status) => updateField('status', status)}
                        />
                    </Stack>
                </DialogContent>

                <EventFormActions
                    submitLabel={isEdit ? 'Save changes' : 'Save event'}
                    onCancel={onClose}
                />
            </Box>
        </Dialog>
    );
}
