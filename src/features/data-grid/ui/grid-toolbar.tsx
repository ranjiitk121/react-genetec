import type { MouseEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

import { toolbarBarSx } from './index.styles';

type GridToolbarProps = {
    isManageOpen: boolean;
    onManageColumns: (event: MouseEvent<HTMLElement>) => void;
};

export function GridToolbar({ isManageOpen, onManageColumns }: GridToolbarProps) {
    return (
        <Box sx={toolbarBarSx}>
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
