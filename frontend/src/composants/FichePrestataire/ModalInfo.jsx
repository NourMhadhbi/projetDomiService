// components/ModalInfo.jsx
import React from 'react';
import {
    Modal,
    Box,
    Typography,
    IconButton,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { grey, orange } from '@mui/material/colors';

export default function ModalInfo({
    open,
    onClose,
    rendezVousActuel,
    onEdit,
    onDelete,
    STATUTS,
}) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            BackdropProps={{ invisible: true }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300, // réduit
                    bgcolor: 'white',
                    boxShadow: '12px 12px 12px 12px rgba(0, 0, 0, 0.12)',
                    borderRadius: 0,
                    border: 'none',
                    outline: 'none',

                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        px: 2,
                        py: 1.5,
                        borderBottom: `1px solid ${grey[300]}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 'bold', color: grey[800] }}
                    >
                        {rendezVousActuel?.raison || `Rendez-vous ${rendezVousActuel?.id}`}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {rendezVousActuel?.statut === 'EN_ATTENTE' && (
                            <>
                                <IconButton size="small" onClick={onEdit} title="Modifier">
                                    <EditIcon sx={{ color: grey[600] }} />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={async () => {
                                        onClose();

                                        setTimeout(async () => {
                                            await onDelete();
                                        }, 200);
                                    }}
                                    title="Supprimer"
                                >
                                    <DeleteIcon sx={{ color: grey[600] }} />
                                </IconButton>

                            </>
                        )}
                        <IconButton size="small" onClick={onClose} title="Fermer">
                            <CloseIcon sx={{ color: grey[600], fontSize: '1.25rem' }} />
                        </IconButton>
                    </Box>
                </Box>

                {/* Body */}
                <Box sx={{ px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon sx={{ color: orange[600] }} />
                        <Typography variant="body2">
                            {rendezVousActuel?.date?.split('T')[1]?.slice(0, 5) || 'Heure non précisée'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PlaceIcon sx={{ color: orange[600] }} />
                        <Typography variant="body2">
                            {rendezVousActuel?.lieuDintervention || 'Lieu non précisé'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InfoIcon sx={{ color: orange[600] }} />
                        <Typography variant="body2">
                            {STATUTS[rendezVousActuel?.statut]?.label || 'Statut inconnu'}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
