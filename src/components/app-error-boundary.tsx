import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import WarningAmberIcon from '@mui/icons-material/WarningAmberRounded';
import RefreshIcon from '@mui/icons-material/Refresh';

import { errorBoxSx, errorIconSx, errorMessageSx } from './query-boundary.styles';

type AppErrorBoundaryProps = {
    children: ReactNode;
    title?: string;
    resetKeys?: unknown[];
};

export function AppErrorBoundary({
    children,
    title = 'Something went wrong',
    resetKeys,
}: AppErrorBoundaryProps) {
    return (
        <ErrorBoundary
            resetKeys={resetKeys}
            // oxlint-disable-next-line react/no-unstable-nested-components -- fallbackRender is react-error-boundary's render-prop API, not a nested component
            fallbackRender={({ error, resetErrorBoundary }) => (
                <Box role="alert" sx={errorBoxSx}>
                    <Box aria-hidden="true" sx={errorIconSx}>
                        <WarningAmberIcon />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1">{title}</Typography>
                        <Typography variant="body2" sx={errorMessageSx}>
                            {error instanceof Error
                                ? error.message
                                : 'An unexpected error occurred.'}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={resetErrorBoundary}
                    >
                        Try again
                    </Button>
                </Box>
            )}
        >
            {children}
        </ErrorBoundary>
    );
}
