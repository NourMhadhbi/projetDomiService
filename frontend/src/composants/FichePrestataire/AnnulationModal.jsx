import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Box,
    Button, Select, MenuItem, TextField, FormControl, InputLabel,
    Typography, Divider, Alert
} from '@mui/material';
import {
    Cancel as CancelIcon,
    Warning as WarningIcon,
    Send as SendIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: 12,
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: 500
    }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
    padding: theme.spacing(2, 3),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5)
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    justifyContent: 'space-between',
    borderTop: `1px solid ${theme.palette.divider}`
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 8,
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    borderRadius: 8,
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: 8,
    textTransform: 'none',
    fontWeight: 600,
    padding: theme.spacing(1, 2.5),
}));

const motifs = [
    'Maladie',
    'Empêchement personnel',
    'Urgence professionnelle',
    'Problème de disponibilité',

    'Autre'
];

const AnnulationModal = ({ open, onClose, onConfirm, dateRendezVous, isMultiple, userRole }) => {
    const [motif, setMotif] = useState('');
    const [autreMotif, setAutreMotif] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    // Déterminer le message en fonction du rôle
    const getRecipientText = () => {
        if (userRole === 'CLIENT') {
            return isMultiple ? 'vos prestataires/entreprises' : 'votre prestataire/entreprise';
        } else {
            return isMultiple ? 'vos clients' : 'votre client';
        }
    };

    const handleConfirm = () => {
        const newErrors = {};

        if (!motif) {
            newErrors.motif = 'Veuillez sélectionner un motif';
        }

        if (motif === 'Autre' && !autreMotif.trim()) {
            newErrors.autreMotif = 'Veuillez préciser le motif';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const motifFinal = motif === 'Autre' ? autreMotif : motif;
        const messageFinal = message || `Votre rendez-vous du ${dateRendezVous} est annulé pour raison de ${motifFinal.toLowerCase()}. Merci de votre compréhension.`;

        onConfirm(motifFinal, messageFinal);
        setMotif('');
        setAutreMotif('');
        setMessage('');
        setErrors({});
    };

    const handleClose = () => {
        setMotif('');
        setAutreMotif('');
        setMessage('');
        setErrors({});
        onClose();
    };

    return (
        <StyledDialog open={open} onClose={handleClose}>
            <StyledDialogTitle sx={{
              
                gap: 1.2,
                mb: 2 
            }}>
                <CancelIcon fontSize="medium" />
                <Typography variant="h6" component="span" fontWeight="600">
                    {isMultiple ? 'Annulation multiple' : 'Annuler le rendez-vous'}
                </Typography>
            </StyledDialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {dateRendezVous && (
                    <Alert
                        severity="warning"
                        icon={<WarningIcon />}
                        sx={{ mb: 2, borderRadius: 2 }}
                    >
                        <Typography variant="body2" fontWeight="500">
                            Rendez-vous du {dateRendezVous}
                        </Typography>
                    </Alert>
                )}

                <FormControl fullWidth sx={{ mb: 2.5 }}>
                    <InputLabel id="motif-label">Motif d'annulation</InputLabel>
                    <StyledSelect
                        labelId="motif-label"
                        value={motif}
                        onChange={(e) => {
                            setMotif(e.target.value);
                            if (errors.motif) setErrors({ ...errors, motif: '' });
                        }}
                        label="Motif d'annulation"
                        error={!!errors.motif}
                    >
                        {motifs.map((m) => (
                            <MenuItem key={m} value={m}>{m}</MenuItem>
                        ))}
                    </StyledSelect>
                    {errors.motif && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                            {errors.motif}
                        </Typography>
                    )}
                </FormControl>

                {motif === 'Autre' && (
                    <StyledTextField
                        fullWidth
                        margin="dense"
                        label="Précisez le motif"
                        value={autreMotif}
                        onChange={(e) => {
                            setAutreMotif(e.target.value);
                            if (errors.autreMotif) setErrors({ ...errors, autreMotif: '' });
                        }}
                        error={!!errors.autreMotif}
                        helperText={errors.autreMotif}
                        sx={{ mb: 2.5 }}
                    />
                )}

                <Divider sx={{ my: 2 }} />

                <StyledTextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Message personnalisé (optionnel)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                        isMultiple
                            ? `Vos rendez-vous ont été annulés pour le motif suivant...`
                            : `Votre rendez-vous du ${dateRendezVous} est annulé pour le motif suivant...`
                    }
                    sx={{ mb: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                    Ce message sera envoyé à {getRecipientText()}
                </Typography>
            </DialogContent>

            <StyledDialogActions>
                <StyledButton
                    onClick={handleClose}
                    startIcon={<CloseIcon />}
                    color="inherit"
                >
                    Fermer
                </StyledButton>
                <StyledButton
                    onClick={handleConfirm}
                    startIcon={<SendIcon />}
                    variant="contained"
                    color="error"
                    sx={{
                        background: 'linear-gradient(45deg, #F44336 30%, #FF5252 90%)',
                        boxShadow: '0 3px 5px 2px rgba(244, 67, 54, .2)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #D32F2F 30%, #F44336 90%)',
                        }
                    }}
                >
                    Confirmer l'annulation
                </StyledButton>
            </StyledDialogActions>
        </StyledDialog>
    );
};

export default AnnulationModal;