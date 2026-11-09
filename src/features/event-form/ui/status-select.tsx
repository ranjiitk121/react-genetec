import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';

import type { EventStatus } from '../shared/types';
import { isEventStatus, STATUS_OPTIONS } from '../shared/utils';
import { labelSx } from './index.styles';

type StatusSelectProps = {
    value: EventStatus;
    onChange: (status: EventStatus) => void;
};

export function StatusSelect({ value, onChange }: StatusSelectProps) {
    function handleChange(event: SelectChangeEvent) {
        if (isEventStatus(event.target.value)) {
            onChange(event.target.value);
        }
    }

    return (
        <FormControl fullWidth>
            <FormLabel id="ef-status-label" sx={labelSx}>
                Status
            </FormLabel>
            <Select labelId="ef-status-label" size="small" value={value} onChange={handleChange}>
                {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
