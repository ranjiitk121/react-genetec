import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

import { emptyIconSx, emptyStateSx } from './grid-empty-row.styles';

export function GridNoColumns({ onReset }: { onReset: () => void }) {
    return (
        <Box component="output" sx={emptyStateSx}>
            <Box aria-hidden="true" sx={emptyIconSx}>
                <ViewColumnIcon fontSize="small" />
            </Box>
            <Box>
                <Typography variant="subtitle1">No columns to show</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Every column is hidden. Turn one back on to see your events.
                </Typography>
            </Box>
            <Button size="small" onClick={onReset}>
                Reset columns
            </Button>
        </Box>
    );
}
