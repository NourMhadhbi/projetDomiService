import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Box,
    useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

const CommentModal = ({ open, onClose, commentData }) => {
    const theme = useTheme();

    if (!commentData) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                    overflow: 'hidden'
                }
            }}
        >
      
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    p: 2,
                    fontSize: '1.15rem',
                    fontWeight: 600
                }}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    <FontAwesomeIcon icon={faComment} size="lg" />
                    Commentaire complet
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{
                        color: '#fff',
                        p: 0.5,
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

      <Box sx={{ height: 12 }} />
            <DialogContent sx={{ p: 2.5, bgcolor: '#fafafa' }}>
                <Box
                    sx={{
                        p: 1.5,
                        bgcolor: '#f5f5f5',
                        borderRadius: 1.2,
                        borderLeft: `3px solid ${theme.palette.primary.main}`,
                        maxHeight: '320px',
                        overflowY: 'auto'
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            lineHeight: 1.5,
                            color: '#333',
                            whiteSpace: 'pre-line',
                            fontSize: '0.95rem'
                        }}
                    >
                        {commentData.commentaire || 'Aucun commentaire'}
                    </Typography>
                </Box>
            </DialogContent>

            {/* Actions */}
            <DialogActions sx={{ p: 1.5, bgcolor: '#fafafa' }}>
                <Box sx={{ flex: 1 }} />
                <IconButton
                    onClick={onClose}
                    sx={{
                        bgcolor: theme.palette.primary.main,
                        color: '#fff',
                        borderRadius: 1.2,
                        px: 2.5,
                        py: 0.6,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        '&:hover': {
                            bgcolor: theme.palette.primary.dark
                        }
                    }}
                >
                    Fermer
                </IconButton>
            </DialogActions>
        </Dialog>
    );
};

export default CommentModal;
