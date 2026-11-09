import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export function GridEmptyRow({
    columnCount,
    filtered,
}: {
    columnCount: number;
    filtered: boolean;
}) {
    const Icon = filtered ? SearchOffIcon : CalendarTodayIcon;
    const title = filtered ? 'No events match these filters' : 'No events yet';
    const message = filtered
        ? 'Try removing or loosening a filter to see more.'
        : 'Events you add show up here and on the timeline.';

    return (
        <TableRow>
            <TableCell colSpan={columnCount} sx={{ height: 'auto', border: 0 }}>
                <Box
                    role={filtered ? 'status' : undefined}
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
                            bgcolor: 'action.hover',
                            color: 'text.secondary',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Icon fontSize="small" />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1">{title}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            {message}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>
        </TableRow>
    );
}
