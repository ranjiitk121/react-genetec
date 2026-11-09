import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

import { closeButtonSx, titleBarSx } from './index.styles';

type EventFormHeaderProps = {
    title: string;
    onClose: () => void;
};

export function EventFormHeader({ title, onClose }: EventFormHeaderProps) {
    return (
        <DialogTitle id="event-form-title" sx={titleBarSx}>
            <Typography variant="h6" component="span">
                {title}
            </Typography>
            <IconButton aria-label="Close" onClick={onClose} sx={closeButtonSx}>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
    );
}
