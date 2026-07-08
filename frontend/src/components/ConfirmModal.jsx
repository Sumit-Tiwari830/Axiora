import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Zoom,
} from '@mui/material';
import { WarningAmber as WarningIcon } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    title = "Confirm Deletion",
    message = "Are you sure you want to delete this? This action cannot be undone."
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            keepMounted
            PaperProps={{
                sx: {
                    borderRadius: '24px',
                    padding: '16px',
                    maxWidth: '400px',
                    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
                }
            }}
        >
            <DialogContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(239, 68, 68, 0.08)',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1
                        }}
                    >
                        <WarningIcon sx={{ fontSize: 32 }} />
                    </Box>
                    
                    <Typography variant="h5" fontWeight={800} color="#0f172a">
                        {title}
                    </Typography>
                    
                    <Typography variant="body2" color="#64748b" sx={{ lineHeight: 1.6 }}>
                        {message}
                    </Typography>
                </Box>
            </DialogContent>
            
            <DialogActions sx={{ justifyContent: 'center', gap: 1.5, px: 3, pb: 2, pt: 1 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 3,
                        py: 1,
                        borderColor: '#cbd5e1',
                        color: '#64748b',
                        '&:hover': {
                            borderColor: '#94a3b8',
                            backgroundColor: 'rgba(148, 163, 184, 0.04)',
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    variant="contained"
                    color="error"
                    sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 3,
                        py: 1,
                        backgroundColor: '#ef4444',
                        '&:hover': {
                            backgroundColor: '#dc2626',
                        }
                    }}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal;
