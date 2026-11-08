// A generic async boundary. Given a TanStack-Query-style `status`, it renders the loading
// fallback, an error message with a Retry affordance, or its children (the success content).
// It knows nothing about grids — it wraps any async content, keeping the thing inside it
// (e.g. <DataGrid>) purely synchronous. The single `status` enum means loading and error can
// never both be "true" at once.

import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export type QueryStatus = 'pending' | 'error' | 'success';

type QueryBoundaryProps = {
    status: QueryStatus;
    /** Shown while `status === 'pending'`. */
    loadingFallback: ReactNode;
    /** The success content. */
    children: ReactNode;
    /** Error surfaced when `status === 'error'`. */
    error?: unknown;
    /** Called by the error state's Retry button; omit to hide it. */
    onRetry?: () => void;
};

export function QueryBoundary({
    status,
    loadingFallback,
    children,
    error,
    onRetry,
}: QueryBoundaryProps) {
    if (status === 'pending') {
        return <>{loadingFallback}</>;
    }

    if (status === 'error') {
        const message = error instanceof Error ? error.message : 'Something went wrong.';
        return (
            <Box
                role="alert"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 6,
                    color: 'error.main',
                }}
            >
                <span>{message}</span>
                {onRetry && (
                    <Button variant="outlined" color="error" onClick={onRetry}>
                        Retry
                    </Button>
                )}
            </Box>
        );
    }

    return <>{children}</>;
}
