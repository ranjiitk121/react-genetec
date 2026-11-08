import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

type ColumnActionsMenuProps = {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    onSortAsc: () => void;
    onSortDesc: () => void;
    onFilter: () => void;
    onManageColumns: () => void;
};

export function ColumnActionsMenu({
    anchorEl,
    open,
    onClose,
    onSortAsc,
    onSortDesc,
    onFilter,
    onManageColumns,
}: ColumnActionsMenuProps) {
    return (
        <Menu id="column-actions-menu" anchorEl={anchorEl} open={open} onClose={onClose}>
            <MenuItem onClick={onSortAsc}>
                <ListItemIcon>
                    <ArrowUpwardIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Sort Ascending</ListItemText>
            </MenuItem>
            <MenuItem onClick={onSortDesc}>
                <ListItemIcon>
                    <ArrowDownwardIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Sort Descending</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={onFilter}>
                <ListItemIcon>
                    <FilterAltIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Filter</ListItemText>
            </MenuItem>
            <MenuItem onClick={onManageColumns}>
                <ListItemIcon>
                    <ViewColumnIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Manage columns</ListItemText>
            </MenuItem>
        </Menu>
    );
}
