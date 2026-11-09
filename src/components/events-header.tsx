import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import WarningAmberIcon from '@mui/icons-material/WarningAmberRounded';

export type View = 'timeline' | 'grid';

type EventsHeaderProps = {
    view: View;
    onViewChange: (view: View) => void;
    onNewEvent: () => void;
    onSimulateError: () => void;
};

export function EventsHeader({
    view,
    onViewChange,
    onNewEvent,
    onSimulateError,
}: EventsHeaderProps) {
    return (
        <>
            <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'flex-end', gap: 2 }}
            >
                <Box>
                    <Typography variant="overline" sx={{ color: 'primary.main' }}>
                        Events console
                    </Typography>
                    <Typography variant="h4">Events</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        Browse the timeline, search the grid, and add new events.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ flexShrink: 0, alignItems: 'center' }}>
                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<WarningAmberIcon />}
                        onClick={onSimulateError}
                    >
                        Simulate error
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onNewEvent}
                    >
                        New event
                    </Button>
                </Stack>
            </Stack>

            <Tabs
                value={view}
                onChange={(_event, next: View) => onViewChange(next)}
                sx={{ mt: 3, borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab value="timeline" label="Timeline" />
                <Tab value="grid" label="Grid" />
            </Tabs>
        </>
    );
}
