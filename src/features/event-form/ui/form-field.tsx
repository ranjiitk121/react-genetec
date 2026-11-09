import { type ReactNode } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineRounded';

import { errorIconSx, errorTextSx, hintTextSx, labelSx, requiredMarkSx } from './index.styles';

type FormFieldProps = {
    id: string;
    label: string;
    required?: boolean;
    error?: string;
    hint?: string;
    children: ReactNode;
};

export function FormField({ id, label, required, error, hint, children }: FormFieldProps) {
    return (
        <FormControl fullWidth error={Boolean(error)}>
            <FormLabel htmlFor={id} sx={labelSx}>
                {label}
                {required && (
                    <Box component="span" aria-hidden="true" sx={requiredMarkSx}>
                        *
                    </Box>
                )}
            </FormLabel>
            {children}
            {error ? (
                <FormHelperText sx={errorTextSx}>
                    <ErrorOutlineIcon sx={errorIconSx} />
                    {error}
                </FormHelperText>
            ) : (
                hint && <FormHelperText sx={hintTextSx}>{hint}</FormHelperText>
            )}
        </FormControl>
    );
}
