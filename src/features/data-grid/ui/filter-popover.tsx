import { useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';

//TODO: can we allow to export this type to extentsibility, which type should be exposed way.
type FilterPopoverProps = {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    label: string;
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
};

export function FilterPopover({
    open,
    anchorEl,
    onClose,
    label,
    value,
    onChange,
    onClear,
}: FilterPopoverProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{ transition: { onEntered: () => inputRef.current?.focus() } }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5 }}>
                <TextField
                    inputRef={inputRef}
                    size="small"
                    variant="outlined"
                    placeholder={`Filter ${label}…`}
                    aria-label={`Filter value for ${label}`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                <Button size="small" onClick={onClear} disabled={value.trim() === ''}>
                    Clear
                </Button>
            </Box>
        </Popover>
    );
}
