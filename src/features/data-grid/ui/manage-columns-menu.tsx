import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import type { Column, VisibilityState } from '../shared/types';
import { isColumnVisible } from '../shared/utils';

type ManageColumnsMenuProps<TRow> = {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    columns: Column<TRow>[];
    visibility: VisibilityState;
    onToggleColumn: (col: Column<TRow>) => void;
    onReset: () => void;
};

export function ManageColumnsMenu<TRow>({
    anchorEl,
    open,
    onClose,
    columns,
    visibility,
    onToggleColumn,
    onReset,
}: ManageColumnsMenuProps<TRow>) {
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            //ADD LABEL
        >
            {columns.map((col) => (
                <MenuItem key={col.id} onClick={() => onToggleColumn(col)}>
                    <Checkbox
                        edge="start"
                        checked={isColumnVisible(col, visibility)}
                        size="small"
                        disableRipple
                    />
                    <ListItemText>{col.label}</ListItemText>
                </MenuItem>
            ))}
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 1 }}>
                <Button size="small" onClick={onReset}>
                    RESET
                </Button>
            </Box>
        </Menu>
    );
}
