import type { MouseEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

type GridToolbarProps = {
    isManageOpen: boolean;
    onManageColumns: (event: MouseEvent<HTMLElement>) => void;
};

export function GridToolbar({ isManageOpen, onManageColumns }: GridToolbarProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                px: 1.5,
                py: 1,
                borderBottom: 1,
                borderColor: 'divider',
            }}
        >
            <Button
                size="small"
                color="inherit"
                startIcon={<ViewColumnIcon fontSize="small" />}
                onClick={onManageColumns}
                aria-haspopup="menu"
                aria-expanded={isManageOpen}
            >
                Columns
            </Button>
        </Box>
    );
}
