import Box from '@mui/material/Box';

export type PillStatus = 'initiated' | 'started' | 'completed';

const STATUS_STYLE: Record<PillStatus, { label: string; dot: string; bg: string; fg: string }> = {
    initiated: { label: 'Initiated', dot: '#3550D8', bg: '#EEF1FD', fg: '#2A40AE' },
    started: { label: 'Started', dot: '#B54708', bg: '#FFF6E5', fg: '#93400A' },
    completed: { label: 'Completed', dot: '#067647', bg: '#ECFDF3', fg: '#05603A' },
};

export function StatusPill({ status }: { status: PillStatus }) {
    const s = STATUS_STYLE[status];
    return (
        <Box
            component="span"
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                height: 24,
                px: 1.25,
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1,
                bgcolor: s.bg,
                color: s.fg,
            }}
        >
            <Box
                component="span"
                aria-hidden="true"
                sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: s.dot }}
            />
            {s.label}
        </Box>
    );
}
