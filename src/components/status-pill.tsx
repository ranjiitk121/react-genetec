import Box from '@mui/material/Box';

import { dotSx, pillSx } from './status-pill.styles';

export type PillStatus = 'initiated' | 'started' | 'completed';

const STATUS_STYLE: Record<PillStatus, { label: string; dot: string; bg: string; fg: string }> = {
    initiated: { label: 'Initiated', dot: '#3550D8', bg: '#EEF1FD', fg: '#2A40AE' },
    started: { label: 'Started', dot: '#B54708', bg: '#FFF6E5', fg: '#93400A' },
    completed: { label: 'Completed', dot: '#067647', bg: '#ECFDF3', fg: '#05603A' },
};

export function StatusPill({ status }: { status: PillStatus }) {
    const s = STATUS_STYLE[status];
    return (
        <Box component="span" sx={pillSx(s.bg, s.fg)}>
            <Box component="span" aria-hidden="true" sx={dotSx(s.dot)} />
            {s.label}
        </Box>
    );
}
