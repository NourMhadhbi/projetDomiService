import { React, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    IconButton,
    Box,
    Typography, Snackbar, Alert
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

export default function RendezVousModal({
    open,
    onClose,
    onSave,
    eventData,
    intervenant,
    setEventData,
    errors, setHeureError, heureError,
}) {

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
    const handleChange = (key, value) => {
        setEventData(prev => ({ ...prev, [key]: value }));
        // setEventData?.(prev => ({ ...prev, [key]: value }));
    };
    const today = new Date();
    // const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
    // const currentTime = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
    const todayStr = new Date().toISOString().split("T")[0];
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

            <Box sx={{ bgcolor: '#FFEFD5', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                    {'Modifier un rendez-vous'}
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent dividers sx={{ pt: 3 }}>
                <TextField
                    label="Nom & Prénom de l’intervenant"
                    fullWidth
                    value={
                        intervenant?.entreprise?.nomEntreprise
                            ? intervenant.entreprise.nomEntreprise
                            : intervenant?.utilisateur.nom + " " + intervenant?.utilisateur.prenom || ''
                    }
                    onChange={e => handleChange('intervenant', e.target.value)}
                    margin="normal"
                    InputProps={{ readOnly: false }}
                />
                <TextField
                    label="Raison du rendez-vous"
                    fullWidth
                    value={eventData?.raison}
                    onChange={e => handleChange('raison', e.target.value)}
                    margin="normal"
                    error={!!errors.raison}
                    helperText={errors.raison}

                />

                <TextField
                    label="Lieu d’intervention"
                    fullWidth
                    value={eventData?.lieuDintervention}
                    onChange={e => handleChange('lieuDintervention', e.target.value)}
                    margin="normal"
                    error={!!errors.lieuDintervention}
                    helperText={errors.lieuDintervention}
                />

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Date"
                            type="date"
                            fullWidth
                            value={eventData?.date}
                            onChange={e => handleChange('date', e.target.value)}
                            margin="normal"
                            InputProps={{ readOnly: false }}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: todayStr }}
                            error={!!errors?.date}
                            helperText={errors?.date}

                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Heure"
                            type="time"
                            fullWidth
                            value={eventData?.heure}
                            onChange={e => handleChange('heure', e.target.value)}
                            margin="normal"

                            InputLabelProps={{ shrink: true }}
                            error={!!errors.heure || !!heureError}
                            helperText={errors.heure || heureError}
                        />
                    </Grid>
                </Grid>


            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #eee' }}>
                <Box sx={{ flex: 1 }} />

                <Button
                    onClick={onClose}
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        borderColor: '#d32f2f',
                        color: '#d32f2f',
                        '&:hover': {
                            backgroundColor: '#d32f2f',
                            color: '#fff',
                            borderColor: '#d32f2f',
                        }
                    }}
                >
                    Annuler
                </Button>

                <Button
                    onClick={onSave}
                    variant="outlined"
                    startIcon={<SaveIcon />}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: 2,
                        px: 2.5,
                        py: 1,
                        ml: 2,
                        borderColor: '#244b8a',
                        color: '#244b8a',
                        '&:hover': {
                            backgroundColor: '#244b8a',
                            color: '#fff',
                            borderColor: '#244b8a',
                        }
                    }}
                >
                    Modifier
                </Button>

            </DialogActions>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Dialog>
    );
}
