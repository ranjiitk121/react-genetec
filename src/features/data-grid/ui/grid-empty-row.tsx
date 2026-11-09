import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import CalendarTodayIcon from '@mui/icons-material/CalendarTodayOutlined';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import { emptyIconSx, emptyStateSx } from './grid-empty-row.styles';

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
                <Box role={filtered ? 'status' : undefined} sx={emptyStateSx}>
                    <Box aria-hidden="true" sx={emptyIconSx}>
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
