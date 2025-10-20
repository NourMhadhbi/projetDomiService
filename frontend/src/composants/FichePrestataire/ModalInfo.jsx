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
import { useSelector } from 'react-redux';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneAllIcon from '@mui/icons-material/DoneAll';
export default function ModalInfo({
    open,
    onClose,
    rendezVousActuel,
    clientid,
    onEdit,
    onDelete,
    STATUTS,
    utilisateur,
    onConfirmer,
    onAnnuler,
    onTerminer, onOpenAnnulationModal
}) {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const estPrestataire = (user?.utilisateur.role === 'PRESTATAIRE' || user?.utilisateur.role === 'ENTREPRISE');
    const estClient = user?.utilisateur.role === 'CLIENT';
    const canCancel = ['EN_ATTENTE', 'CONFIRME'].includes(rendezVousActuel?.statut);
    console.log("role", utilisateur)
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
                    width: 400,
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
                        maxWidth: '100%',

                        backgroundColor: '#fff',
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            color: grey[800],
                            wordWrap: 'break-word',
                            whiteSpace: 'normal',
                            maxWidth: '65%',
                            overflowWrap: 'break-word'
                        }}
                    >
                        {rendezVousActuel?.raison || `Rendez-vous ${rendezVousActuel?.id}`}
                    </Typography>
                    {estClient && user?.utilisateur?.id === clientid && (
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
                                    {/* <IconButton size="small" color="error" onClick={() => onOpenAnnulationModal(rendezVousActuel)} title="Annuler">
                                        <CancelIcon />
                                    </IconButton> */}

                                </>
                            )}
                            {rendezVousActuel?.statut === 'CONFIRME' && (
                                <>

                                    <IconButton size="small" color="error" onClick={() => onOpenAnnulationModal(rendezVousActuel)} title="Annuler">
                                        <CancelIcon />
                                    </IconButton>

                                </>
                            )}
                        </Box>)}

                    {estPrestataire && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {rendezVousActuel?.statut === 'EN_ATTENTE' && (
                                <>
                                    <IconButton size="small" color="success" onClick={() => onConfirmer(rendezVousActuel.id)} title="Confirmer">
                                        <CheckCircleIcon />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => onOpenAnnulationModal(rendezVousActuel)} title="Annuler">
                                        <CancelIcon />
                                    </IconButton>
                                </>
                            )}
                            {rendezVousActuel?.statut === 'CONFIRME' && (
                                <>
                                    <IconButton size="small" color="primary" onClick={() => onTerminer(rendezVousActuel.id)} title="Terminer">
                                        <DoneAllIcon />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => onOpenAnnulationModal(rendezVousActuel)} title="Annuler">
                                        <CancelIcon />
                                    </IconButton>
                                </>
                            )}
                        </Box>
                    )}
                    <IconButton size="small" onClick={onClose} title="Fermer">
                        <CloseIcon sx={{ color: grey[600], fontSize: '1.25rem' }} />
                    </IconButton>
                </Box>

                {/* Body */}
                <Box sx={{ px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon sx={{ color: orange[600] }} />
                        <Typography variant="body2">
                            {rendezVousActuel?.date?.split('T')[1]?.slice(0, 5) || 'Heure non précisée'}
                        </Typography>
                    </Box>
                    {((estClient && user?.utilisateur?.id === clientid) || estPrestataire) && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PlaceIcon sx={{ color: orange[600] }} />
                            <Typography variant="body2">
                                {rendezVousActuel?.lieuDintervention || 'Lieu non précisé'}
                            </Typography>
                        </Box>)}
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
