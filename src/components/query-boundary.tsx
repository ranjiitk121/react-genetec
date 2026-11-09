// A generic async boundary. Given a TanStack-Query-style `status`, it renders the loading
// fallback, an error message with a Retry affordance, or its children (the success content).
// It knows nothing about grids — it wraps any async content, keeping the thing inside it
// (e.g. <DataGrid>) purely synchronous. The single `status` enum means loading and error can
// never both be "true" at once.

import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import WarningAmberIcon from '@mui/icons-material/WarningAmberRounded';
import RefreshIcon from '@mui/icons-material/Refresh';

export type QueryStatus = 'pending' | 'error' | 'success';

type QueryBoundaryProps = {
    status: QueryStatus;
    loadingFallback: ReactNode;
    children: ReactNode;
    error?: unknown;
    onRetry?: () => void;
    isFetching?: boolean;
};

export function QueryBoundary({
    status,
    loadingFallback,
    children,
    error,
    onRetry,
    isFetching,
}: QueryBoundaryProps) {
    if (status === 'pending') {
        return <>{loadingFallback}</>;
    }

    if (status === 'error') {
        const message = error instanceof Error ? error.message : 'The data source didn’t respond.';
        return (
            <Box
                role="alert"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 7,
                    px: 3,
                    textAlign: 'center',
                }}
            >
                <Box
                    aria-hidden="true"
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: 'error.light',
                        color: 'error.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <WarningAmberIcon />
                </Box>
                <Box>
                    <Typography variant="subtitle1">Couldn’t load events</Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', mt: 0.5, maxWidth: 360 }}
                    >
                        {message}
                    </Typography>
                </Box>
                {onRetry && (
                    <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        loading={isFetching}
                        onClick={onRetry}
                    >
                        Retry
                    </Button>
                )}
            </Box>
        );
    }

    return <>{children}</>;
}
