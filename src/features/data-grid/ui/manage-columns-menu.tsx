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
    onSetAllVisibility: (visible: boolean) => void;
    onReset: () => void;
};

export function ManageColumnsMenu<TRow>({
    anchorEl,
    open,
    onClose,
    columns,
    visibility,
    onToggleColumn,
    onSetAllVisibility,
    onReset,
}: ManageColumnsMenuProps<TRow>) {
    const allVisible = columns.every((col) => isColumnVisible(col, visibility));
    const someVisible = columns.some((col) => isColumnVisible(col, visibility));

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
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pr: 1,
                }}
            >
                {/* TODO: fix issue with inner menu jumping */}
                <MenuItem sx={{ flex: 1 }} onClick={() => onSetAllVisibility(!allVisible)}>
                    <Checkbox
                        edge="start"
                        checked={allVisible}
                        indeterminate={someVisible && !allVisible}
                        size="small"
                        disableRipple
                    />
                    <ListItemText>Show/Hide All</ListItemText>
                </MenuItem>
                <Button size="small" onClick={onReset}>
                    RESET
                </Button>
            </Box>
        </Menu>
    );
}
