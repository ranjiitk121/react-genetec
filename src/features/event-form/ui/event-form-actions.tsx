import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';

import { actionsSx } from './index.styles';

type EventFormActionsProps = {
    submitLabel: string;
    onCancel: () => void;
};

export function EventFormActions({ submitLabel, onCancel }: EventFormActionsProps) {
    return (
        <DialogActions sx={actionsSx}>
            <Button type="button" variant="outlined" color="inherit" onClick={onCancel}>
                Cancel
            </Button>
            <Button type="submit" variant="contained">
                {submitLabel}
            </Button>
        </DialogActions>
    );
}
