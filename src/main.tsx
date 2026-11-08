import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './index.css';
import App from './App.tsx';

// One client for the app. `retry: false` keeps the demo's "Force error" state deterministic
// (no background retries before the error surfaces); flip it on for real endpoints.
const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

// MUI defaults to a light palette, but the app's CSS flips to dark via prefers-color-scheme.
// Match MUI to the OS so its text/surfaces aren't light-on-dark (invisible).
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = createTheme({ palette: { mode: prefersDark ? 'dark' : 'light' } });

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>,
);
